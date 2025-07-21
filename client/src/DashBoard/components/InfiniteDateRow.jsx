import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function InfiniteDateRow({ selectedDate, onDateChange }) {
  const [dates, setDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const scrollContainerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const userScrollTimeoutRef = useRef(null);
  const navigationTimeoutRef = useRef(null);

  // Constants
  const BUTTON_WIDTH = 70;
  const BUTTON_GAP = 12;
  const ELEMENT_WIDTH = BUTTON_WIDTH + BUTTON_GAP;

  // Generate dates function - MUST be defined before use
  const generateDates = useCallback((startDate, count = 30) => {
    const dateArray = [];
    const baseDate = new Date(startDate);
    
    for (let i = 0; i < count; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      dateArray.push(date);
    }
    return dateArray;
  }, []);

  // Initialize dates with expanded range
  useEffect(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 60); // 60 days before today
    
    const initialDates = generateDates(startDate, 180); // 180 days total
    setDates(initialDates);
    
    setTimeout(() => {
      scrollToDateInstant(selectedDate || today);
    }, 300);
  }, [generateDates]); // Add generateDates to dependencies

  // Instant scroll function for initialization
  const scrollToDateInstant = useCallback((targetDate) => {
    if (!scrollContainerRef.current) return;
    
    const targetDateString = targetDate.toDateString();
    const targetIndex = dates.findIndex(date => date.toDateString() === targetDateString);
    
    if (targetIndex !== -1) {
      const container = scrollContainerRef.current;
      const scrollPosition = targetIndex * ELEMENT_WIDTH - (container.clientWidth / 2) + (ELEMENT_WIDTH / 2);
      
      container.scrollLeft = Math.max(0, scrollPosition);
    }
  }, [dates]);

  // Smooth scroll function for daily navigation
  const scrollToDateSmooth = useCallback((targetDate, direction = 'none') => {
    if (!scrollContainerRef.current) return;
    
    const targetDateString = targetDate.toDateString();
    const targetIndex = dates.findIndex(date => date.toDateString() === targetDateString);
    
    if (targetIndex !== -1) {
      const container = scrollContainerRef.current;
      let scrollPosition;
      
      if (direction === 'forward') {
        scrollPosition = targetIndex * ELEMENT_WIDTH - (container.clientWidth / 3);
      } else if (direction === 'backward') {
        scrollPosition = targetIndex * ELEMENT_WIDTH - (container.clientWidth * 2/3);
      } else {
        scrollPosition = targetIndex * ELEMENT_WIDTH - (container.clientWidth / 2) + (ELEMENT_WIDTH / 2);
      }
      
      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  }, [dates]);

  // Handle selectedDate changes
  useEffect(() => {
    if (selectedDate && dates.length > 0 && !isUserScrolling && !isNavigating) {
      const container = scrollContainerRef.current;
      if (container) {
        const targetIndex = dates.findIndex(date => date.toDateString() === selectedDate.toDateString());
        if (targetIndex !== -1) {
          const targetElement = container.children[targetIndex];
          if (targetElement) {
            const containerRect = container.getBoundingClientRect();
            const elementRect = targetElement.getBoundingClientRect();
            
            const isVisible = elementRect.left >= containerRect.left && 
                             elementRect.right <= containerRect.right;
            
            if (!isVisible) {
              scrollToDateInstant(selectedDate);
            }
          }
        }
      }
    }
  }, [selectedDate, dates, isUserScrolling, isNavigating, scrollToDateInstant]);

  // Daily navigation functions
  const navigateOneDay = useCallback((direction) => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    const currentDate = selectedDate || new Date();
    const targetDate = new Date(currentDate);
    
    if (direction === 'forward') {
      targetDate.setDate(currentDate.getDate() + 1);
    } else {
      targetDate.setDate(currentDate.getDate() - 1);
    }
    
    // Check if we need to generate more dates
    const targetDateString = targetDate.toDateString();
    const dateExists = dates.some(date => date.toDateString() === targetDateString);
    
    if (!dateExists) {
      if (direction === 'forward') {
        const lastDate = dates[dates.length - 1];
        const nextDate = new Date(lastDate);
        nextDate.setDate(lastDate.getDate() + 1);
        const newDates = generateDates(nextDate, 30);
        setDates(prev => [...prev, ...newDates]);
      } else {
        const firstDate = dates[0];
        const prevDate = new Date(firstDate);
        prevDate.setDate(firstDate.getDate() - 30);
        const newDates = generateDates(prevDate, 30);
        setDates(prev => [...newDates, ...prev]);
      }
    }
    
    setTimeout(() => {
      onDateChange(targetDate);
      scrollToDateSmooth(targetDate, direction);
      
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      
      navigationTimeoutRef.current = setTimeout(() => {
        setIsNavigating(false);
      }, 600);
    }, 100);
    
  }, [selectedDate, onDateChange, dates, generateDates, isNavigating, scrollToDateSmooth]);

  // Month navigation
  const navigateToMonth = useCallback((event, monthOffset) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    const currentDate = selectedDate || new Date();
    const targetDate = new Date(currentDate);
    targetDate.setMonth(currentDate.getMonth() + monthOffset);
    
    // Handle edge cases for month navigation
    const originalDay = currentDate.getDate();
    targetDate.setDate(1);
    targetDate.setMonth(currentDate.getMonth() + monthOffset);
    const lastDayOfTargetMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
    targetDate.setDate(Math.min(originalDay, lastDayOfTargetMonth));
    
    // Ensure we have dates for the target month
    const targetDateString = targetDate.toDateString();
    const dateExists = dates.some(date => date.toDateString() === targetDateString);
    
    if (!dateExists) {
      const startDate = new Date(targetDate);
      startDate.setDate(1);
      startDate.setDate(startDate.getDate() - 30);
      const newDates = generateDates(startDate, 90);
      
      setDates(prevDates => {
        const existingDateStrings = new Set(prevDates.map(d => d.toDateString()));
        const uniqueNewDates = newDates.filter(d => !existingDateStrings.has(d.toDateString()));
        
        if (uniqueNewDates.length > 0) {
          const combinedDates = [...prevDates, ...uniqueNewDates]
            .sort((a, b) => a.getTime() - b.getTime());
          return combinedDates;
        }
        return prevDates;
      });
    }
    
    setTimeout(() => {
      onDateChange(targetDate);
      scrollToDateInstant(targetDate);
      
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
      
      navigationTimeoutRef.current = setTimeout(() => {
        setIsNavigating(false);
      }, 800);
    }, 150);
    
  }, [selectedDate, onDateChange, dates, generateDates, isNavigating, scrollToDateInstant]);

  // Scroll handler
  const handleScroll = useCallback((e) => {
    if (isNavigating) return;
    
    setIsUserScrolling(true);
    
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }
    
    userScrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 1000);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (isLoading) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = e.target;
      const loadThreshold = 500;
      
      // Load more future dates
      if (scrollLeft + clientWidth > scrollWidth - loadThreshold) {
        setIsLoading(true);
        const lastDate = dates[dates.length - 1];
        const nextDate = new Date(lastDate);
        nextDate.setDate(lastDate.getDate() + 1);
        const newDates = generateDates(nextDate, 20);
        setDates(prev => [...prev, ...newDates]);
        setTimeout(() => setIsLoading(false), 200);
      }

      // Load previous dates
      if (scrollLeft < loadThreshold && dates.length > 0) {
        setIsLoading(true);
        const firstDate = dates[0];
        const prevDate = new Date(firstDate);
        prevDate.setDate(firstDate.getDate() - 20);
        const newDates = generateDates(prevDate, 20);
        const currentScrollLeft = scrollLeft;
        
        setDates(prev => [...newDates, ...prev]);
        
        requestAnimationFrame(() => {
          if (scrollContainerRef.current) {
            const scrollAdjustment = newDates.length * ELEMENT_WIDTH;
            scrollContainerRef.current.scrollLeft = currentScrollLeft + scrollAdjustment;
          }
        });
        
        setTimeout(() => setIsLoading(false), 200);
      }
    }, 200);
  }, [dates, isLoading, generateDates, isNavigating]);

  // Format date function
  const formatDate = useCallback((date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateToCheck = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    return {
      day: date.getDate(),
      dayName: date.toLocaleDateString('en', { weekday: 'short' }),
      month: date.toLocaleDateString('en', { month: 'short' }),
      isToday: dateToCheck.getTime() === today.getTime(),
      isSelected: selectedDate && dateToCheck.getTime() === new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()).getTime(),
      isPast: dateToCheck < today,
      isFuture: dateToCheck > today
    };
  }, [selectedDate]);

  // Date click handler
  const handleDateClick = useCallback((event, date) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (isNavigating) return;
    
    if (!selectedDate || date.toDateString() !== selectedDate.toDateString()) {
      onDateChange(date);
    }
  }, [onDateChange, selectedDate, isNavigating]);

  // Navigation button handlers
  const navigateToToday = useCallback((event) => {
    event.preventDefault();
    const today = new Date();
    onDateChange(today);
  }, [onDateChange]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (userScrollTimeoutRef.current) clearTimeout(userScrollTimeoutRef.current);
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    };
  }, []);

  // In your InfiniteDateRow component, update the return statement:
return (
  <div className="w-full bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden">
    {/* Enhanced Header */}
    <div className="bg-gradient-to-r from-teal-500 to-blue-600 px-6 py-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={(e) => navigateToMonth(e, -1)}
          disabled={isNavigating}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-110 disabled:opacity-50"
          title="Previous Month"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
          </svg>
        </button>
        
        <div className="text-center">
          <h3 className="text-xl font-bold text-white">
            {(selectedDate || new Date()).toLocaleDateString('en', { month: 'long', year: 'numeric' })}
          </h3>
          <p className="text-teal-100 text-sm mt-1">
            {(selectedDate || new Date()).toLocaleDateString('en', { weekday: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <button
          type="button"
          onClick={(e) => navigateToMonth(e, 1)}
          disabled={isNavigating}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-110 disabled:opacity-50"
          title="Next Month"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17l5-5-5-5M6 17l5-5-5-5" />
          </svg>
        </button>
      </div>
    </div>

    {/* Enhanced Daily Navigation */}
    <div className="flex items-center justify-between px-6 py-3 bg-gray-50/50 border-b border-gray-100/50">
      <button
        type="button"
        onClick={() => navigateOneDay('backward')}
        disabled={isNavigating}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white/50 hover:bg-white/80 rounded-full border border-gray-200/50 hover:border-gray-300 transition-all duration-200 hover:scale-105 disabled:opacity-50"
        title="Previous Day"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span>Previous</span>
      </button>
      
      <div className="text-center">
        <p className="text-xs text-gray-500">Navigate by day</p>
      </div>
      
      <button
        type="button"
        onClick={() => navigateOneDay('forward')}
        disabled={isNavigating}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white/50 hover:bg-white/80 rounded-full border border-gray-200/50 hover:border-gray-300 transition-all duration-200 hover:scale-105 disabled:opacity-50"
        title="Next Day"
      >
        <span>Next</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    {/* Enhanced Date Container */}
    <div 
      ref={scrollContainerRef}
      className="flex overflow-x-auto space-x-4 p-6 bg-gradient-to-r from-gray-50/50 to-white/50 custom-scrollbar"
      onScroll={handleScroll}
    >
      {dates.map((date, index) => {
        const { day, dayName, month, isToday, isSelected, isPast, isFuture } = formatDate(date);
        
        return (
          <button
            key={`${date.getTime()}-${index}`}
            type="button"
            onClick={(e) => handleDateClick(e, date)}
            disabled={isNavigating}
            className={`
              flex flex-col items-center justify-center relative flex-shrink-0
              w-20 h-24 rounded-2xl transition-all duration-300 transform
              ${isSelected 
                ? 'bg-gradient-to-b from-teal-500 to-blue-600 text-white shadow-xl scale-110 -translate-y-1' 
                : isToday 
                  ? 'bg-gradient-to-b from-teal-50 to-blue-50 text-teal-700 border-2 border-teal-400 shadow-lg hover:shadow-xl'
                  : isPast
                    ? 'bg-white/50 text-gray-400 border border-gray-200 hover:border-gray-300 hover:shadow-md'
                    : 'bg-white/80 text-gray-700 border border-gray-200 hover:border-teal-400 hover:shadow-lg hover:scale-105'
              }
              ${isNavigating ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
              focus:outline-none focus:ring-4 focus:ring-teal-200 focus:ring-opacity-50
            `}
          >
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              isSelected ? 'text-teal-100' : isToday ? 'text-teal-600' : 'text-gray-500'
            }`}>
              {dayName}
            </span>
            
            <span className={`text-2xl font-bold ${
              isSelected ? 'text-white' : isToday ? 'text-teal-700' : isPast ? 'text-gray-400' : 'text-gray-800'
            }`}>
              {day}
            </span>
            
            <span className={`text-xs font-medium ${
              isSelected ? 'text-teal-100' : isToday ? 'text-teal-600' : 'text-gray-500'
            }`}>
              {month}
            </span>
            
            {isSelected && (
              <div className="absolute -bottom-1 w-2 h-2 bg-white rounded-full"></div>
            )}
            
            {isToday && !isSelected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full border-2 border-white animate-pulse"></div>
            )}
          </button>
        );
      })}
      
      {isLoading && (
        <div className="flex items-center justify-center w-20 h-24 flex-shrink-0">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-teal-600 border-t-transparent"></div>
        </div>
      )}
    </div>
  </div>
);

}
