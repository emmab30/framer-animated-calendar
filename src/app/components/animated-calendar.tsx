import { useState, useEffect } from "react";
import moment from "moment";
import { AnimatePresence, motion, easeInOut, easeOut, easeIn, useAnimationControls } from "framer-motion";
import { BiChevronLeft, BiChevronRight, BiX } from "react-icons/bi";

interface CalendarProps {
    isOpen: boolean;
    date: moment.Moment;
    minDate?: moment.Moment;
    maxDate?: moment.Moment;
    weekDays: string[];

    // Handled actions
    onChangeDate: (date: moment.Moment) => void;
    onClose: () => void;
}

export function AnimatedCalendar({ isOpen, date, onChangeDate, onClose, minDate, maxDate, weekDays }: CalendarProps) {
    // Animation states
    const headerAnimationControl = useAnimationControls();
    const calendarAnimationControl = useAnimationControls();

    const [showingDays, setShowingDays] = useState(false);
    const [currentDate, setCurrentDate] = useState(date || moment());

    const [view, setView] = useState<"calendar" | "month" | "year">("calendar");
    const [yearRange, setYearRange] = useState([currentDate.year() - 50, currentDate.year()]);

    const months = moment.months();
    const years = Array.from({ length: yearRange[1] - yearRange[0] + 1 }, (_, i) => yearRange[0] + i);

    const generateCalendarDays = () => {
        const startDay = currentDate.clone().startOf("month").startOf("week");
        const endDay = currentDate.clone().endOf("month").endOf("week");
        const days = [];

        const day = startDay.clone();
        while (day.isBefore(endDay)) {
            days.push(day.clone());
            day.add(1, "day");
        }

        return days;
    };

    const handleNextMonths = (numberOfMonths: number) => {
        setCurrentDate((prev) => prev.clone().add(numberOfMonths, "month"));
    };

    const handlePrevMonths = (numberOfMonths: number) => {
        setCurrentDate((prev) => prev.clone().subtract(numberOfMonths, "month"));
    };

    const handleNextYears = (numberOfYears: number) => {
        setCurrentDate((prev) => prev.clone().add(numberOfYears, "year"));
    };

    const handlePrevYears = (numberOfYears: number) => {
        setCurrentDate((prev) => prev.clone().subtract(numberOfYears, "year"));
    };

    const handlePrevMonth = () => handlePrevMonths(1);
    const handleNextMonth = () => handleNextMonths(1);

    const handleMonthClick = async () => setView("month");
    const handleYearClick = () => setView("year");

    const handleMonthSelect = (month: number) => {
        setCurrentDate((prev) => prev.month(month));
        setView("calendar");
    };

    const handleYearSelect = (year: number) => {
        setCurrentDate((prev) => prev.year(year));
        setView("calendar");
    };

    useEffect(() => {
        if (minDate && maxDate) {
            setYearRange([minDate.year(), maxDate.year()]);
        }
    }, [minDate, maxDate]);

    const isCalendarView = view === "calendar";
    const isMonthView = view === "month";
    const isYearView = view === "year";

    const isDateDisabled = (date: moment.Moment) => {
        if (minDate && date.isBefore(minDate, "day")) return true;
        if (maxDate && date.isAfter(maxDate, "day")) return true;
        return false;
    };

    const handleSwipe = (_: unknown, info: { offset: { x: number; y: number } }) => {
        if (view === "calendar") {
            if (info.offset.x < -75) {
                handleNextMonths(1);
            } else if (info.offset.x > 75) {
                handlePrevMonths(1);
            } else if (info.offset.y < -75) {
                handlePrevYears(1);
            } else if (info.offset.y > 75) {
                handleNextYears(1);
            }
        }
    };

    const startSequence = async () => {
        await calendarAnimationControl.start(
            {
                y: 0,
            },
            {
                duration: 0.2,
            }
        );

        await headerAnimationControl.start(
            {
                y: 0,
                opacity: 1,
            },
            {
                duration: 0.2,
                ease: easeInOut,
            }
        );

        // This flag is to manage the opacity of the days in the calendar for the first time it's rendered.
        setShowingDays(true);
    };

    useEffect(() => {
        if (isOpen) {
            startSequence();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const handleClose = async () => {
        await calendarAnimationControl.start(
            {
                y: "100%",
                opacity: 0,
            },
            {
                ease: easeIn,
            }
        );

        onClose();
    };

    if (!isOpen) return null;

    const renderHeader = () => (
        <motion.div
            initial={{
                y: 20,
                opacity: 0,
            }}
            animate={headerAnimationControl}
            className="flex justify-between items-center mb-4">
            {isCalendarView ? (
                <motion.button
                    style={{ width: 38 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full bg-gray-700 text-white">
                    <BiChevronLeft size={20} />
                </motion.button>
            ) : (
                <motion.button
                    style={{ width: 38 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full text-white"></motion.button>
            )}

            {isCalendarView ? (
                <div className="flex space-x-2">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleMonthClick} className="text-lg font-semibold text-white">
                        {currentDate.format("DD")}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleMonthClick} className="text-lg font-semibold text-white">
                        {currentDate.format("MMMM")}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleYearClick} className="text-lg font-semibold text-white">
                        {currentDate.format("YYYY")}
                    </motion.button>
                </div>
            ) : (
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-lg font-semibold text-white">
                    {isMonthView ? "Choose month" : isYearView ? "Choose year" : "Choose date"}
                </motion.button>
            )}

            <motion.button
                onClick={
                    view === "calendar"
                        ? handleNextMonth
                        : () => {
                              setView("calendar");
                          }
                }
                className="p-2 rounded-full bg-gray-700 text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}>
                {view === "calendar" ? <BiChevronRight size={20} /> : <BiX size={20} />}
            </motion.button>
        </motion.div>
    );

    const renderCalendarView = () => (
        <>
            <div key="calendar-days" className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => (
                    <div key={day} className="text-center font-light text-gray-400">
                        {day}
                    </div>
                ))}
                <AnimatePresence mode="popLayout">
                    <motion.div key={currentDate.format("MMYYYY")} className="col-span-7 grid grid-cols-7 gap-2">
                        {generateCalendarDays().map((day, index) => {
                            const isThisMonth = day.isSame(currentDate, "month");
                            return (
                                <motion.div
                                    key={day.format("DDMMYYYY")}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: showingDays ? (isThisMonth ? 1 : 0.5) : 0, y: showingDays ? 0 : 20 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: index * 0.0075 }}
                                    onClick={(e) => {
                                        if (!isDateDisabled(day)) {
                                            e.stopPropagation();
                                            setCurrentDate(day);
                                        }
                                    }}
                                    className={`text-center p-2 text-center w-full cursor-pointer ${isDateDisabled(day) ? "text-gray-400 cursor-not-allowed" : "text-white"}`}
                                    style={{
                                        position: "relative",
                                        overflow: "hidden",
                                        fontWeight: 400,
                                    }}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={
                                            day.isSame(currentDate, "day")
                                                ? {
                                                      opacity: 1,
                                                      scale: [1.2, 1],
                                                      backgroundPosition: ["0% 50%", "100% 50%"],
                                                      transition: { duration: 0.2, ease: [0.17, 0.67, 0.83, 0.67], type: "spring", stiffness: 300 },
                                                  }
                                                : { opacity: 0, scale: 0 }
                                        }
                                        style={{
                                            position: "absolute",
                                            top: "0%",
                                            left: "0%",
                                            width: "100%",
                                            height: "100%",
                                            background: "linear-gradient(90deg, #2E63EB, #3e71f2, #2E63EB)",
                                            backgroundSize: "200% 200%",
                                            borderRadius: 5,
                                            zIndex: -1,
                                        }}
                                    />
                                    {day.format("D")}
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="flex justify-end mt-4">
                <motion.button
                    whileHover={{ scale: 1.01, opacity: 0.8 }}
                    whileTap={{ scale: 0.99, opacity: 0.6 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onChangeDate(currentDate);
                        handleClose();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg w-full font-bold">
                    Apply
                </motion.button>
            </div>
        </>
    );

    const renderMonthView = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-3 gap-4">
            {months.map((month, index) => (
                <motion.button
                    key={month}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMonthSelect(index)}
                    className="p-2 rounded text-white text-sm relative overflow-hidden"
                    style={{ width: "100%", height: 40, textAlign: "center" }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={
                            currentDate.month() === index
                                ? {
                                      opacity: 1,
                                      scale: [1.2, 1],
                                      backgroundPosition: ["0% 50%", "100% 50%"],
                                      transition: { duration: 0.2, ease: [0.17, 0.67, 0.83, 0.67], type: "spring", stiffness: 300 },
                                  }
                                : { opacity: 0, scale: 0 }
                        }
                        style={{
                            position: "absolute",
                            top: "0%",
                            left: "0%",
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(90deg, #2E63EB, #3e71f2, #2E63EB)",
                            backgroundSize: "200% 200%",
                            borderRadius: 10,
                            zIndex: -1,
                        }}
                    />
                    {month}
                </motion.button>
            ))}
        </motion.div>
    );

    const renderYearView = () => (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100%" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex overflow-x-auto snap-x snap-mandatory custom-scrollbar"
            style={{ scrollSnapType: "x mandatory" }}>
            {years.reverse().map((year, index) => (
                <motion.button
                    key={year}
                    id={`year-${year}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.001 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleYearSelect(year)}
                    className="p-2 rounded text-white text-sm relative overflow-hidden snap-center"
                    style={{ flex: "0 0 auto", width: 80, height: 50 }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={
                            currentDate.year() === year
                                ? {
                                      opacity: 1,
                                      scale: [1.2, 1],
                                      backgroundPosition: ["0% 50%", "100% 50%"],
                                      transition: { duration: 0.2, ease: [0.17, 0.67, 0.83, 0.67], type: "spring", stiffness: 300 },
                                  }
                                : { opacity: 0, scale: 0 }
                        }
                        style={{
                            position: "absolute",
                            top: "0%",
                            left: "0%",
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(90deg, #2E63EB, #3e71f2, #2E63EB)",
                            backgroundSize: "200% 200%",
                            borderRadius: 10,
                            zIndex: -1,
                        }}
                    />
                    {year}
                </motion.button>
            ))}
        </motion.div>
    );

    return (
        <AnimatePresence mode="popLayout">
            {isOpen && (
                <motion.div
                    initial={{
                        y: "100%",
                    }}
                    animate={calendarAnimationControl}
                    transition={{ duration: 0.3, ease: easeOut }} // Smooth transition
                    className="fixed bottom-0 left-0 w-full p-4 rounded-t-lg shadow-xl custom-scrollbar"
                    style={{
                        backgroundColor: "#1A202C",
                        color: "#CBD5E0",
                        fontFamily: "'Roboto', sans-serif",
                        overflowY: "hidden", // Add scroll if content exceeds height
                    }}
                    onPanEnd={handleSwipe} // Add this line to handle swipe gestures
                >
                    <AnimatePresence mode="popLayout">
                        {renderHeader()}
                        {view === "calendar" && <motion.div key="calendar">{renderCalendarView()}</motion.div>}
                        {view === "month" && renderMonthView()}
                        {view === "year" && renderYearView()}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Add custom scrollbar styles
const styles = `
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4f46e5;
    border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9333ea;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #1A202C;
}

/* Add no-scroll class to disable scrolling */
.no-scroll {
    overflow: hidden;
}
`;

// Inject styles into the document
if (typeof document !== "undefined") {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}
