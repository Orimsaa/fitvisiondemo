"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import Script from "next/script";

function CameraContent() {
    const searchParams = useSearchParams();
    const model = searchParams.get("model")?.toLowerCase() || "benchpress";

    const [currentExercise, setCurrentExercise] = useState(model);
    const [repGoal, setRepGoal] = useState(12);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

    const exerciseName = currentExercise === "squat" ? "Back Squat" : currentExercise === "deadlift" ? "Deadlift" : "Bench Press";
    const isGoodForm = currentExercise === "squat" || currentExercise === "benchpress";

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isModelReady, setIsModelReady] = useState(false);
    const [areScriptsLoaded, setAreScriptsLoaded] = useState(false);

    useEffect(() => {
        if (!areScriptsLoaded) return;

        // At this point, window.Pose, window.Camera, etc. should be available
        const win = window as any;
        const Pose = win.Pose;
        const Camera = win.Camera;
        const drawConnectors = win.drawConnectors;
        const drawLandmarks = win.drawLandmarks;
        const POSE_CONNECTIONS = win.POSE_CONNECTIONS;

        if (!Pose || !Camera) return;

        let camera: any = null;
        let pose: any = null;
        let isUnmounted = false;

        const initMediaPipe = async () => {
            if (!videoRef.current || !canvasRef.current) return;

            const videoElement = videoRef.current;
            const canvasElement = canvasRef.current;
            const canvasCtx = canvasElement.getContext("2d");

            pose = new Pose({
                locateFile: (file: string) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                },
            });

            pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableSegmentation: false,
                smoothSegmentation: false,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            pose.onResults((results: any) => {
                if (isUnmounted) return;
                setIsModelReady(true);

                if (!canvasCtx || !canvasElement || !videoElement) return;

                if (canvasElement.width !== videoElement.videoWidth) {
                    canvasElement.width = videoElement.videoWidth;
                    canvasElement.height = videoElement.videoHeight;
                }

                canvasCtx.save();
                canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

                if (results.poseLandmarks) {
                    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: "#38ff14", lineWidth: 4 });
                    drawLandmarks(canvasCtx, results.poseLandmarks, { color: "#ef4444", lineWidth: 2, radius: 4 });
                }
                canvasCtx.restore();
            });

            camera = new Camera(videoElement, {
                onFrame: async () => {
                    if (isUnmounted) return;
                    if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
                        await pose?.send({ image: videoElement });
                    }
                },
                width: 640,
                height: 480,
                facingMode: facingMode
            });

            camera.start();
        };

        initMediaPipe();

        return () => {
            isUnmounted = true;
            if (camera) {
                camera.stop();
            }
            if (pose) {
                pose.close();
            }
        };
    }, [areScriptsLoaded, facingMode]);

    const feedbackModel =
        currentExercise === "squat"
            ? { title: "Depth Check", detail: "Squat depth is good, break parallel to hit full range of motion." }
            : currentExercise === "deadlift"
                ? { title: "Correction Needed", detail: "Keep your back straight. Hips are rising too fast." }
                : { title: "Bar Path Check", detail: "Keep your elbows tucked and lower the bar to your lower chest." };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col overflow-hidden relative">
            {/* Scripts to load MediaPipe from CDN */}
            <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" strategy="lazyOnload" />
            <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" strategy="lazyOnload" />
            <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" strategy="lazyOnload"
                onLoad={() => {
                    // Slight delay to ensure all scripts are fully ready on window
                    setTimeout(() => setAreScriptsLoaded(true), 500);
                }}
            />

            {/* Real Camera Feed */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 z-0 w-full h-full object-cover"
                style={{
                    filter: "brightness(0.6) contrast(1.1)",
                    transform: facingMode === "user" ? "scaleX(-1)" : "scaleX(1)", // Mirror only for front camera
                }}
            />

            {/* Tech Overlay Pattern */}
            <div className="absolute inset-0 z-0 bg-grid-pattern pointer-events-none"></div>

            {/* Skeletal Tracking Overlay (Canvas) */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover opacity-80"
                    style={{
                        transform: facingMode === "user" ? "scaleX(-1)" : "scaleX(1)", // Must match video mirroring
                    }}
                />
            </div>

            {/* UI Layer */}
            <div className="relative z-20 flex flex-col h-full justify-between p-4 md:p-6 lg:p-8 grow">
                {/* Header */}
                <header className="flex items-center justify-between w-full">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-white/90 hover:text-primary transition-colors bg-black/20 backdrop-blur-md px-3 md:px-4 py-2 rounded-full border border-white/10 shadow-lg"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back_ios_new</span>
                        <span className="font-medium hidden md:block">Back</span>
                    </Link>
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Switch Camera Button (Mobile only) */}
                        <button
                            onClick={() => setFacingMode(prev => prev === "user" ? "environment" : "user")}
                            className="md:hidden flex items-center justify-center size-10 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white hover:text-primary transition-colors shadow-lg active:scale-95"
                            title="Flip Camera"
                        >
                            <span className="material-symbols-outlined">flip_camera_ios</span>
                        </button>

                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 shadow-lg">
                            <span className="material-symbols-outlined text-primary text-sm">videocam</span>
                            <span className="text-xs font-bold text-white tracking-wider">AI VISION ACTIVE</span>
                        </div>
                        <div className={`text-white px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg ${isModelReady ? "animate-pulse-red bg-red-600 shadow-red-900/50" : "bg-orange-500 shadow-orange-900/50"}`}>
                            <div className={`w-2 h-2 rounded-full bg-white ${isModelReady ? "animate-pulse" : ""}`}></div>
                            <span className="text-xs md:text-xs font-bold tracking-widest">{isModelReady ? "LIVE" : "LOADING AI"}</span>
                        </div>
                    </div>
                </header>

                {/* Center Area (Empty for camera view clarity) */}
                <div className="flex-1 border-4 border-dashed border-primary/10 rounded-3xl m-4 pointer-events-none hidden md:block"></div>

                {/* Bottom Controls & Info */}
                <div className="w-full flex flex-col items-center gap-3 md:gap-6 pb-2 md:pb-4 pointer-events-auto mt-auto">
                    {/* Compact Analysis Card */}
                    <div className="w-full max-w-md bg-background-dark/60 md:bg-background-dark/80 backdrop-blur-md md:backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-5 shadow-lg relative overflow-hidden group">
                        {/* Subtle green glow effect */}
                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/20 blur-3xl rounded-full"></div>
                        <div className="flex flex-col gap-2 md:gap-3">

                            {/* Top Row: Exercise selection and Form Score side-by-side */}
                            <div className="flex justify-between items-center gap-3">
                                <div className="flex flex-col w-full relative">
                                    <select
                                        value={currentExercise}
                                        onChange={(e) => setCurrentExercise(e.target.value)}
                                        className="appearance-none bg-black/40 border border-white/10 rounded-xl text-white font-bold py-2 md:py-3 pl-3 md:pl-4 pr-8 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full cursor-pointer transition-all hover:bg-black/60 shadow-inner text-sm md:text-base"
                                    >
                                        <option value="benchpress">Bench Press</option>
                                        <option value="squat">Back Squat</option>
                                        <option value="deadlift">Deadlift</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">expand_more</span>
                                </div>

                                {/* Status Badge - smaller on mobile */}
                                <div className="shrink-0">
                                    <div className="px-2 md:px-3 py-1 md:py-2 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl text-primary font-bold flex flex-col items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.15)] min-w-[60px] md:min-w-[80px]">
                                        <span className="text-[9px] md:text-[10px] text-primary/80 uppercase tracking-widest leading-none mb-0.5">Form</span>
                                        <span className="text-lg md:text-xl leading-none">85<span className="text-[10px] md:text-xs">%</span></span>
                                    </div>
                                </div>
                            </div>

                            {/* Alert / Feedback Section - more compact */}
                            <div className={`flex items-start gap-2 border rounded-xl p-2 md:p-3 ${isGoodForm ? "bg-primary/10 border-primary/30" : "bg-red-500/10 border-red-500/30"}`}>
                                <span className={`material-symbols-outlined shrink-0 text-lg md:text-xl ${isGoodForm ? "text-primary" : "text-red-400"}`}>
                                    {isGoodForm ? "info" : "warning"}
                                </span>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className={`font-bold text-xs md:text-sm truncate ${isGoodForm ? "text-primary" : "text-red-300"}`}>
                                        {feedbackModel.title}
                                    </span>
                                    <span className={`${isGoodForm ? "text-primary" : "text-red-200"} text-[11px] md:text-sm leading-tight opacity-90 line-clamp-2`}>
                                        {isModelReady ? feedbackModel.detail : "Warming up AI model... Please stand in frame."}
                                    </span>
                                </div>
                            </div>

                            {/* Stats Row - horizontal scrollable on very small screens, normally flex */}
                            <div className="flex gap-2 mt-1">
                                <div className="flex-1 bg-black/40 rounded-lg p-1.5 md:p-2 flex items-center justify-center gap-1.5 border border-white/5">
                                    <span className="material-symbols-outlined text-primary text-sm md:text-base">health_and_safety</span>
                                    <span className="text-[10px] md:text-xs text-white font-medium whitespace-nowrap">Risk: Low</span>
                                </div>
                                <div className="flex-1 bg-black/40 rounded-lg p-1.5 md:p-2 flex items-center justify-center gap-1.5 border border-white/5 relative">
                                    <span className="material-symbols-outlined text-blue-400 text-sm md:text-base">fitness_center</span>
                                    <span className="text-[10px] md:text-xs text-white font-medium flex items-center gap-1">
                                        Reps: <span className="text-blue-400 font-bold">0</span>/
                                        <input
                                            type="number"
                                            value={repGoal}
                                            onChange={(e) => setRepGoal(Number(e.target.value) || 1)}
                                            className="bg-transparent border-b border-white/20 w-8 text-center focus:outline-none focus:border-primary px-0 py-0 m-0"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Action Button - smaller height on mobile */}
                    <Link
                        href="/summary"
                        className="w-full max-w-md h-12 md:h-14 bg-red-600/90 backdrop-blur-md hover:bg-red-500 active:scale-[0.98] transition-all rounded-xl text-white font-bold text-base md:text-lg shadow-lg shadow-red-900/40 border border-red-500/50 flex items-center justify-center gap-2 md:gap-3 cursor-pointer"
                    >
                        <span className="material-symbols-outlined">stop_circle</span>
                        End Analysis
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function CameraPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Camera...</div>}>
            <CameraContent />
        </Suspense>
    );
}
