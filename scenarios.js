/**
 * MG Slot 動作模組庫
 * 所有的動態參數 (duration, ease) 都定義在此，方便未來快速微調規格
 */
const Scenarios = {

    // 1. 常駐框與乘倍發射邏輯
    stickyCollect: async (targetId, machineId, sourceId, isMultiplier) => {
        const target = document.getElementById(targetId);
        const machine = document.getElementById(machineId);
        const source = document.getElementById(sourceId);

        const mRect = machine.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();
        const sRect = source.getBoundingClientRect();

        // 建立框框
        const frame = document.createElement('div');
        frame.className = 'sticky-frame';
        frame.style.left = (tRect.left - mRect.left) + 'px';
        frame.style.top = (tRect.top - mRect.top) + 'px';
        if (isMultiplier) {
            frame.innerHTML = `<div class="mult-tag">X5</div>`;
        }
        machine.appendChild(frame);

        // 建立飛行粒子
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = (sRect.left - mRect.left + 30) + 'px';
        p.style.top = (sRect.top - mRect.top + 30) + 'px';
        if (isMultiplier) p.innerText = "X5";
        machine.appendChild(p);

        const tl = gsap.timeline();
        // 來源符號震動回饋
        tl.to(source, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 });
        
        // 飛行表演 (自然弧線)
        await tl.to(p, {
            left: (tRect.left - mRect.left + 30),
            top: (tRect.top - mRect.top + 30),
            duration: 0.6,
            ease: "power2.out"
        });

        p.remove();

        // 命中生長動畫
        gsap.to(frame, { 
            scale: 1, 
            opacity: 1, 
            duration: 0.4, 
            ease: "elastic.out(1, 0.7)",
            onStart: () => {
                gsap.to(target, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
            }
        });
    },

    // 2. Nudge 逐格表演邏輯
    nudgeReel: (reelId, targetSymId) => {
        const reel = document.getElementById(reelId);
        const sym = document.getElementById(targetSymId);
        
        const tl = gsap.timeline();
        // 輪軸預備震動
        tl.to(reel, { y: 15, duration: 0.1, yoyo: true, repeat: 4, ease: "none" });
        // 選中符號強化回饋
        tl.to(sym, { 
            backgroundColor: "#333", 
            border: "2px solid #00f2fe",
            boxShadow: "0 0 15px #00f2fe",
            scale: 1.05,
            duration: 0.4,
            ease: "back.out(2)"
        });
    }
};
