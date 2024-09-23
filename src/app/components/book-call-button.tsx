"use client";

import { useState } from "react";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { BiCalendar } from "react-icons/bi";
import { AnimatedCalendar } from "./animated-calendar";

export default function BookCallButton() {
    const [isShowingCalendar, setIsShowingCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(moment());

    const handleClick = () => {
        setIsShowingCalendar(true);
        document.body.classList.add("no-scroll"); // Disable scrolling
    };

    const handleClose = () => {
        setIsShowingCalendar(false);
        document.body.classList.remove("no-scroll"); // Enable scrolling
    };

    return (
        <motion.button
            className="relative flex items-center justify-between w-64 h-16 px-4 py-2 text-white bg-blue-600 rounded-full shadow-lg"
            onClick={handleClick}
            style={{
                boxShadow: "0px 0px 20px 5px rgba(0, 255, 255, 0.2)",
            }}>
            <motion.div
                className="to-hide"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: isShowingCalendar ? "100%" : "75%",
                    alignItems: "center",
                }}>
                <AnimatePresence initial={false} custom={selectedDate} mode="popLayout">
                    {isShowingCalendar && (
                        <motion.span
                            key={selectedDate.format("DD-MM-YYYY")}
                            className="text-lg font-semibold"
                            style={{
                                position: "absolute",
                                left: 0,
                                display: "block",
                                maxWidth: "100%",
                                textAlign: "center",
                                fontSize: 16,
                            }}
                            initial={{ width: "100%", opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}>
                            {selectedDate.format("DD MMMM, YYYY")}
                        </motion.span>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {!isShowingCalendar && (
                        <motion.span
                            className="text-lg font-semibold"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                                fontSize: 16,
                            }}>
                            {selectedDate.format("DD MMMM, YYYY")}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {!isShowingCalendar && (
                    <motion.div
                        className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 5 }}
                        exit={{ opacity: 0, x: 10 }}>
                        <BiCalendar className="w-24 h-6" key="calendar" />
                    </motion.div>
                )}
            </AnimatePresence>

            {isShowingCalendar && (
                <AnimatedCalendar
                    date={selectedDate}
                    onChangeDate={setSelectedDate}
                    isOpen={isShowingCalendar}
                    onClose={handleClose}
                    minDate={moment()}
                    maxDate={moment().add(10, "year")}
                    weekDays={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
                />
            )}
        </motion.button>
    );
}
