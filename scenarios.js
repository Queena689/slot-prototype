// 這裡封裝所有的表演邏輯
const Scenarios = {
    // 常駐框收集邏輯
    stickyCollect: (targetId, machineId, sourceId) => {
        const target = document.getElementById(targetId);
        const machine = document.getElementById(machineId);
        const source = document.getElementById(sourceId);
        
        // 取得位置與執行 GSAP 動態 (把之前的 GSAP 代碼搬過來)
        console.log("執行常駐框表演於:", targetId);
        gsap.fromTo(target, { scale: 0 }, { scale: 1, duration: 0.5, ease: "back.out" });
    },

    // 逐格推動邏輯
    nudgeReel: (reelId) => {
        const reel = document.getElementById(reelId);
        console.log("執行 Nudge 表演於:", reelId);
        gsap.to(reel, { y: 20, duration: 0.1, yoyo: true, repeat: 5 });
    }
};
