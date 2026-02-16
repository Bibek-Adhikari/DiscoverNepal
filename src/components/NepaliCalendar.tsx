import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react';

// Nepali digits mapping
const nepaliDigits: { [key: string]: string } = {
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
  '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
};

// Convert English number to Nepali
const toNepaliNumber = (num: number): string => {
  return num.toString().split('').map(d => nepaliDigits[d] || d).join('');
};

// Month data for 2082 BS with accurate days
const NEPALI_MONTHS_2082 = [
  { name: 'Baisakh', nameNp: 'बैशाख', days: 31, index: 0, enMonths: 'Apr/May' },
  { name: 'Jestha', nameNp: 'जेठ', days: 31, index: 1, enMonths: 'May/Jun' },
  { name: 'Ashad', nameNp: 'असार', days: 32, index: 2, enMonths: 'Jun/Jul' },
  { name: 'Shrawan', nameNp: 'साउन', days: 31, index: 3, enMonths: 'Jul/Aug' },
  { name: 'Bhadra', nameNp: 'भदौ', days: 31, index: 4, enMonths: 'Aug/Sep' },
  { name: 'Ashoj', nameNp: 'असोज', days: 30, index: 5, enMonths: 'Sep/Oct' },
  { name: 'Kartik', nameNp: 'कार्तिक', days: 31, index: 6, enMonths: 'Oct/Nov' },
  { name: 'Mangsir', nameNp: 'मंसिर', days: 29, index: 7, enMonths: 'Nov/Dec' },
  { name: 'Poush', nameNp: 'पुष', days: 30, index: 8, enMonths: 'Dec/Jan' },
  { name: 'Magh', nameNp: 'माघ', days: 29, index: 9, enMonths: 'Jan/Feb' },
  { name: 'Falgun', nameNp: 'फाल्गुन', days: 30, index: 10, enMonths: 'Feb/Mar' },
  { name: 'Chaitra', nameNp: 'चैत', days: 30, index: 11, enMonths: 'Mar/Apr' }
];

// Week days
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK_DAYS_NP = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि'];
const WEEK_DAYS_FULL_NP = ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहिबार', 'शुक्रबार', 'शनिबार'];

// Major festivals and holidays for 2082 BS (based on Hamro Patro data)
const FESTIVALS_2082: { [key: string]: { name: string; nameNp: string; type: 'public' | 'religious' | 'cultural' | 'international' }[] } = {
  // Baisakh (April-May)
  '0-1': [{ name: 'New Year 2082', nameNp: 'नयाँ वर्ष २०८२', type: 'public' }],
  '0-11': [{ name: 'Loktantra Diwas', nameNp: 'लोकतन्त्र दिवस', type: 'public' }],
  '0-14': [{ name: "Mother's Day", nameNp: 'आमाको मुख हेर्ने दिन', type: 'cultural' }],
  '0-18': [{ name: 'International Workers Day', nameNp: 'अन्तर्राष्ट्रिय श्रमिक दिवस', type: 'international' }],
  '0-29': [{ name: 'Buddha Jayanti', nameNp: 'बुद्ध जयन्ती', type: 'public' }],
  
  // Jestha (May-June)
  '1-15': [{ name: 'Republic Day', nameNp: 'गणतन्त्र दिवस', type: 'public' }],
  '1-24': [{ name: 'Eid-Ul-Adha', nameNp: 'ईद-उल-अधा', type: 'public' }],
  
  // Ashad (June-July)
  '2-15': [{ name: 'Dahi Chiura Khane Din', nameNp: 'दही चिउरा खाने दिन', type: 'cultural' }],
  '2-31': [{ name: 'Saune Sankranti', nameNp: 'साउने संक्रान्ति', type: 'religious' }],
  
  // Shrawan (July-August)
  '3-1': [{ name: 'Gunla Dharma', nameNp: 'गुँला धर्म', type: 'religious' }],
  '3-15': [{ name: 'Janai Purnima', nameNp: 'जनै पूर्णिमा', type: 'public' }],
  '3-16': [{ name: 'Raksha Bandhan', nameNp: 'रक्षा बन्धन', type: 'religious' }],
  '3-23': [{ name: 'Krishna Janmashtami', nameNp: 'कृष्ण जन्माष्टमी', type: 'public' }],
  '3-24': [{ name: 'Gaijatra', nameNp: 'गाईजात्रा', type: 'cultural' }],
  
  // Bhadra (August-September)
  '4-3': [{ name: 'Haritalika Teej', nameNp: 'हरितालिका तीज', type: 'public' }],
  '4-10': [{ name: 'Rishi Panchami', nameNp: 'ऋषि पञ्चमी', type: 'religious' }],
  '4-15': [{ name: 'Gaura Parva', nameNp: 'गौरा पर्व', type: 'cultural' }],
  '4-21': [{ name: 'Indra Jatra', nameNp: 'इन्द्रजात्रा', type: 'cultural' }],
  '4-30': [{ name: 'Jitiya', nameNp: 'जितिया', type: 'cultural' }],
  
  // Ashoj (September-October)
  '5-3': [{ name: 'Constitution Day', nameNp: 'संविधान दिवस', type: 'public' }],
  '5-6': [{ name: 'Ghatasthapana', nameNp: 'घटस्थापना', type: 'public' }],
  '5-13': [{ name: 'Fulpati', nameNp: 'फूलपाती', type: 'public' }],
  '5-14': [{ name: 'Maha Ashtami', nameNp: 'महाअष्टमी', type: 'public' }],
  '5-15': [{ name: 'Maha Nawami', nameNp: 'महानवमी', type: 'public' }],
  '5-16': [{ name: 'Vijaya Dashami', nameNp: 'विजया दशमी', type: 'public' }],
  
  // Kartik (October-November)
  '6-1': [{ name: 'Kag Tihar', nameNp: 'काग तिहार', type: 'public' }],
  '6-2': [{ name: 'Kukur Tihar', nameNp: 'कुकुर तिहार', type: 'public' }],
  '6-3': [{ name: 'Laxmi Puja', nameNp: 'लक्ष्मी पूजा', type: 'public' }],
  '6-4': [{ name: 'Gai Tihar/Govardhan Puja', nameNp: 'गाई तिहार/गोवर्द्धन पूजा', type: 'public' }],
  '6-5': [{ name: 'Bhai Tika', nameNp: 'भाइटीका', type: 'public' }],
  '6-10': [{ name: 'Chhath Parva', nameNp: 'छठ पर्व', type: 'public' }],
  '6-15': [{ name: 'Hari Bodhini Ekadashi', nameNp: 'हरिबोधिनी एकादशी', type: 'religious' }],
  
  // Mangsir (November-December)
  '7-17': [{ name: 'International Disability Day', nameNp: 'अन्तर्राष्ट्रिय अपाङ्ग दिवस', type: 'international' }],
  '7-18': [{ name: 'Udhauli/Yomari Punhi', nameNp: 'उधौली/योमरी पुन्ही', type: 'cultural' }],
  '7-25': [{ name: 'Falgunanda Jayanti', nameNp: 'फाल्गुनन्द जयन्ती', type: 'public' }],
  
  // Poush (December-January)
  '8-10': [{ name: 'Christmas', nameNp: 'क्रिसमस', type: 'public' }],
  '8-15': [{ name: 'Tamu Lhosar', nameNp: 'तामाङ ल्होसार', type: 'public' }],
  '8-27': [{ name: 'Prithvi Jayanti', nameNp: 'पृथ्वी जयन्ती', type: 'public' }],
  
  // Magh (January-February)
  '9-1': [{ name: 'Maghe Sankranti', nameNp: 'माघे संक्रान्ति', type: 'public' }],
  '9-5': [{ name: 'Sonam Lhosar', nameNp: 'सोनाम ल्होसार', type: 'public' }],
  '9-9': [{ name: 'Basanta Panchami', nameNp: 'वसन्तपञ्चमी', type: 'cultural' }],
  '9-16': [{ name: 'Martyrs Day', nameNp: 'सहिद दिवस', type: 'public' }],
  
  // Falgun (February-March)
  '10-3': [{ name: 'Maha Shivaratri', nameNp: 'महाशिवरात्रि', type: 'public' }],
  '10-6': [{ name: 'Gyalpo Lhosar', nameNp: 'ग्याल्पो ल्होसार', type: 'public' }],
  '10-7': [{ name: 'Democracy Day', nameNp: 'प्रजातन्त्र दिवस', type: 'public' }],
  '10-18': [{ name: 'Holi (Hilly)', nameNp: 'होली (पहाडी)', type: 'public' }],
  '10-19': [{ name: 'Holi (Terai)', nameNp: 'होली (तराई)', type: 'public' }],
  '10-24': [{ name: "Women's Day", nameNp: 'अन्तर्राष्ट्रिय महिला दिवस', type: 'international' }],
  
  // Chaitra (March-April)
  '11-4': [{ name: 'Ghode Jatra', nameNp: 'घोडेजात्रा', type: 'cultural' }],
  '11-13': [{ name: 'Ram Nawami', nameNp: 'राम नवमी', type: 'religious' }],
  '11-17': [{ name: 'Mahabir Jayanti', nameNp: 'महावीर जयन्ती', type: 'religious' }],
  '11-30': [{ name: 'Chaite Dashain', nameNp: 'चैते दशैं', type: 'religious' }],
};

// Calculate starting day of week for each month in 2082 BS
// Baisakh 1, 2082 = Monday (April 14, 2025)
const getStartDayOfWeek = (monthIndex: number): number => {
  // Correct daysBefore based on 2082 BS (Baisakh 1 = Monday)
  // Baisakh: 31, Jestha: 31, Asar: 32, Shrawan: 31, Bhadra: 31, Ashwin: 30, 
  // Kartik: 31, Mangsir: 29, Poush: 30, Magh: 29, Falgun: 30, Chaitra: 30
  const daysBefore = [0, 31, 62, 94, 125, 156, 186, 217, 246, 276, 305, 335];
  const totalDays = daysBefore[monthIndex];
  return (1 + totalDays) % 7; // 1 = Monday, 0 = Sunday
};

// Get festivals for a specific date
const getFestivals = (monthIndex: number, day: number) => {
  const key = `${monthIndex}-${day}`;
  return FESTIVALS_2082[key] || [];
};

// Get festival color based on type
const getFestivalColor = (type: string) => {
  switch (type) {
    case 'public': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
    case 'religious': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800';
    case 'cultural': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    case 'international': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
};

interface NepaliCalendarProps {
  className?: string;
  onDateSelect?: (date: { year: number; month: number; day: number }) => void;
}

export const NepaliCalendar: React.FC<NepaliCalendarProps> = ({ 
  className = '',
  onDateSelect 
}) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<{month: number, day: number} | null>(null);
  const [showFestivalInfo, setShowFestivalInfo] = useState(false);
  const year = 2082;

  const currentMonth = NEPALI_MONTHS_2082[currentMonthIndex];
  const startDay = getStartDayOfWeek(currentMonthIndex);
  const daysInMonth = currentMonth.days;

  // Generate calendar days
  const generateDays = () => {
    const days = [];
    const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
    
    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startDay + 1;
      if (i < startDay || dayNumber > daysInMonth) {
        days.push(null);
      } else {
        days.push(dayNumber);
      }
    }
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonthIndex(prev => prev === 0 ? 11 : prev - 1);
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex(prev => prev === 11 ? 0 : prev + 1);
    setSelectedDate(null);
  };

  const handleDateClick = (day: number) => {
    setSelectedDate({month: currentMonthIndex, day});
    if (onDateSelect) {
      onDateSelect({ year, month: currentMonthIndex + 1, day });
    }
  };

  const calendarDays = generateDays();
  const todayFestivals = selectedDate ? getFestivals(selectedDate.month, selectedDate.day) : [];

  return (
      <div className={`w-full max-w-5xl mx-auto p-4 ${className}`}>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white flex items-center gap-3 justify-center md:justify-start">
              <span className="text-red-600 dark:text-red-500">नेपाली</span> पात्रो
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Bikram Sambat 2082 • Unified Nepali Calendar Experience
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFestivalInfo(!showFestivalInfo)}
              className={`p-2 rounded-full transition-colors ${showFestivalInfo ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}
              title="Toggle Festival Info"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Calendar Card */}
          <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 dark:from-red-800 dark:via-red-900 dark:to-red-950 p-6 text-white relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <button
                  onClick={handlePrevMonth}
                  className="p-3 rounded-full hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-1">
                    {currentMonth.nameNp}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-red-100">
                    <span className="text-lg font-medium">{currentMonth.name}</span>
                    <span className="text-sm opacity-75">({currentMonth.enMonths})</span>
                  </div>
                  <div className="text-2xl font-bold mt-1 opacity-90">{toNepaliNumber(year)}</div>
                </div>

                <button
                  onClick={handleNextMonth}
                  className="p-3 rounded-full hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Month Progress Indicator */}
              <div className="relative z-10 mt-6 flex justify-center gap-1.5">
                {NEPALI_MONTHS_2082.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentMonthIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentMonthIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
                    }`}
                    title={NEPALI_MONTHS_2082[idx].nameNp}
                  />
                ))}
              </div>
            </div>

            {/* Week Headers */}
            <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
              {WEEK_DAYS.map((day, idx) => (
                <div
                  key={day}
                  className={`py-3 text-center text-xs md:text-sm font-bold uppercase tracking-wider ${
                    idx === 0 || idx === 6 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  <div className="hidden md:block">{WEEK_DAYS_NP[idx]}</div>
                  <div className="md:hidden text-[10px]">{WEEK_DAYS_NP[idx].substring(0, 3)}</div>
                  <div className="text-[10px] opacity-60 font-normal">{day}</div>
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-px bg-neutral-200 dark:bg-neutral-800">
              {calendarDays.map((day, index) => {
                const isWeekend = index % 7 === 0 || index % 7 === 6;
                const isSelected = selectedDate?.month === currentMonthIndex && selectedDate?.day === day;
                const festivals = day ? getFestivals(currentMonthIndex, day) : [];
                const hasFestival = festivals.length > 0;
                
                return (
                  <button
                    key={index}
                    onClick={() => day && handleDateClick(day)}
                    disabled={!day}
                    className={`
                      relative bg-white dark:bg-neutral-900 p-2 md:p-3 min-h-[60px] md:min-h-[80px] flex flex-col items-center justify-start transition-all
                      ${!day ? 'invisible' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}
                      ${isSelected ? 'ring-2 ring-inset ring-red-500 dark:ring-red-400 bg-red-50 dark:bg-red-900/10' : ''}
                    `}
                  >
                    {day && (
                      <>
                        <div className={`
                          w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-sm md:text-base font-semibold transition-colors
                          ${isSelected ? 'bg-red-600 text-white dark:bg-red-500' : ''}
                          ${!isSelected && isWeekend ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20' : ''}
                          ${!isSelected && !isWeekend ? 'text-neutral-900 dark:text-neutral-100' : ''}
                        `}>
                          {toNepaliNumber(day)}
                        </div>
                        
                        {/* Festival Indicators */}
                        {hasFestival && (
                          <div className="mt-1 flex flex-wrap justify-center gap-0.5 max-w-full">
                            {festivals.slice(0, 2).map((f, i) => (
                              <div 
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  f.type === 'public' ? 'bg-red-500' :
                                  f.type === 'religious' ? 'bg-orange-500' :
                                  f.type === 'cultural' ? 'bg-purple-500' : 'bg-blue-500'
                                }`}
                                title={f.nameNp}
                              />
                            ))}
                            {festivals.length > 2 && (
                              <span className="text-[8px] text-neutral-400">+</span>
                            )}
                          </div>
                        )}
                        
                        {/* Mobile Festival Names */}
                        <div className="md:hidden mt-0.5 text-[8px] text-center leading-tight text-neutral-500 dark:text-neutral-400 line-clamp-1 px-1">
                          {festivals[0]?.nameNp}
                        </div>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side Panel - Festival Info & Details */}
          <div className="space-y-4">
            {/* Selected Date Info */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 mb-4 text-neutral-500 dark:text-neutral-400">
                <CalendarIcon className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wider">Selected Date</span>
              </div>
              
              {selectedDate ? (
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-neutral-900 dark:text-white">
                    {NEPALI_MONTHS_2082[selectedDate.month].nameNp} {toNepaliNumber(selectedDate.day)}
                  </div>
                  <div className="text-lg text-neutral-600 dark:text-neutral-400">
                    {WEEK_DAYS_FULL_NP[(getStartDayOfWeek(selectedDate.month) + selectedDate.day - 1) % 7]}
                  </div>
                  <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <div className="text-sm text-neutral-500 dark:text-neutral-500">English Date</div>
                    <div className="text-neutral-900 dark:text-neutral-200 font-medium">
                      Approx. {new Date(2025, 3 + selectedDate.month, selectedDate.day).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-neutral-400 dark:text-neutral-600 italic text-center py-4">
                  Select a date to view details
                </div>
              )}
            </div>

            {/* Festivals List */}
            {showFestivalInfo && (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-800">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Festivals & Holidays
                </h3>
                
                {selectedDate && todayFestivals.length > 0 ? (
                  <div className="space-y-3">
                    {todayFestivals.map((festival, idx) => (
                      <div 
                        key={idx}
                        className={`p-3 rounded-xl border ${getFestivalColor(festival.type)}`}
                      >
                        <div className="font-bold text-sm md:text-base">{festival.nameNp}</div>
                        <div className="text-xs opacity-80 mt-0.5">{festival.name}</div>
                        <div className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-white/50 dark:bg-black/20">
                          {festival.type}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : selectedDate ? (
                  <div className="text-neutral-500 dark:text-neutral-500 text-center py-4 text-sm">
                    No festivals on this date
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {Object.entries(FESTIVALS_2082)
                      .filter(([key]) => key.startsWith(`${currentMonthIndex}-`))
                      .map(([key, festivals]) => {
                        const day = parseInt(key.split('-')[1]);
                        return festivals.map((f, i) => (
                          <div 
                            key={`${key}-${i}`}
                            onClick={() => setSelectedDate({month: currentMonthIndex, day})}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors group"
                          >
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                              ${getFestivalColor(f.type).split(' ')[0]} ${getFestivalColor(f.type).split(' ')[1]}
                            `}>
                              {toNepaliNumber(day)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                {f.nameNp}
                              </div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-500 truncate">{f.name}</div>
                            </div>
                          </div>
                        ));
                      })}
                    {Object.entries(FESTIVALS_2082).filter(([key]) => key.startsWith(`${currentMonthIndex}-`)).length === 0 && (
                      <div className="text-neutral-400 dark:text-neutral-600 text-center py-4 text-sm">
                        No major festivals this month
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 rounded-2xl p-6 text-white shadow-lg">
              <h4 className="font-bold text-lg mb-3">२०८२ at a Glance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-red-100">Total Days</span>
                  <span className="font-bold">{toNepaliNumber(365)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-100">Public Holidays</span>
                  <span className="font-bold">{toNepaliNumber(Object.values(FESTIVALS_2082).filter(f => f.some(x => x.type === 'public')).length)}+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-100">Weekends</span>
                  <span className="font-bold">{toNepaliNumber(104)}</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow border border-neutral-200 dark:border-neutral-800">
              <h4 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">Legend</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-neutral-700 dark:text-neutral-300">Public Holiday</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-neutral-700 dark:text-neutral-300">Religious</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-neutral-700 dark:text-neutral-300">Cultural</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-neutral-700 dark:text-neutral-300">International</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-600">
          <p>Data based on official Government of Nepal calendar • Hamro Patro Style Interface</p>
          <p className="mt-1 text-xs">Bikram Sambat 2082 (April 2025 - April 2026)</p>
        </div>
      </div>
  );
};

// Example usage component
export const NepaliCalendarPage: React.FC = () => {
  const handleDateSelect = (date: { year: number; month: number; day: number }) => {
    console.log('Selected date:', date);
  };

  return (
    <NepaliCalendar 
      onDateSelect={handleDateSelect}
      className="py-8"
    />
  );
};