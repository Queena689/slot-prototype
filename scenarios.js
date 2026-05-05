/**
 * MG Slot 動作指令引擎 - 擴展版
 */
const Scenarios = {
    
    // 1. 核心動作：中心點擴展表演 (上下各延展，共5格)
    nudgeExpand: async (centerId) => {
        const [_, reelIdx, rowIdx] = centerId.split('-').map(Number);
        const rowCount = parseInt(document.getElementById('rows').value);
        const centerSym = document.getElementById(centerId);
        
        if (!centerSym) return;

        console.log(`執行擴展表演，中心點: ${centerId}`);
        const tl = gsap.timeline();

        // Step 1: 中心符號先變色並震動
        tl.to(centerSym, { 
            backgroundColor: "#ffd700", 
            innerText: "COIN",
            color: "#000",
            scale: 1.2,
            duration: 0.2,
            ease: "back.out(2)"
        });

        // Step 2: 定義上下擴展的距離 (1格與2格)
        const expansionSteps = [
            { offset: 1, color: "rgba(255, 215, 0, 0.8)" }, // 鄰居
            { offset: 2, color: "rgba(255, 215, 0, 0.5)" }  // 邊緣
        ];

        // Step 3: 依序執行擴散動畫
        for (const step of expansionSteps) {
            const targets = [];
            if (rowIdx - step.offset >= 0) targets.push(`s-${reelIdx}-${rowIdx - step.offset}`);
            if (rowIdx + step.offset < rowCount) targets.push(`s-${reelIdx}-${rowIdx + step.offset}`);

            targets.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    tl.to(el, {
                        backgroundColor: step.color,
                        innerText: "COIN",
                        color: "#000",
                        scale: 1.1,
                        border: "2px solid #ffd700",
                        boxShadow: "0 0 15px #ffd700",
                        duration: 0.15,
                        ease: "power2.out"
                    }, "-=0.05"); // 稍微重疊，讓動作更流暢
                }
            });
        }

        // 最後全體彈跳一下
        tl.to(`[id^="s-${reelIdx}-"]`, { 
            y: -5, 
            duration: 0.1, 
            yoyo: true, 
            repeat: 1 
        });

        return tl;
    },

    // 2. 既有的盤面震動
    shake: (duration = 0.5) => {
        return gsap.to('#machine', { 
            x: 8, 
            duration: 0.05, 
            yoyo: true, 
            repeat: Math.floor(duration / 0.05) 
        });
    },

    // 3. 基礎發射 (相容舊邏輯)
    launch: async (targetId, multiplier = "") => {
        const machine = document.getElementById('machine');
        const target = document.getElementById(targetId);
        const reels = parseInt(document.getElementById('reels').value);
        const rows = parseInt(document.getElementById('rows').value);
        const source = document.getElementById(`s-${reels-1}-${rows-1}`);

        const mRect = machine.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();
        const sRect = source.getBoundingClientRect();

        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = (sRect.left - mRect.left + 30) + 'px';
        p.style.top = (sRect.top - mRect.top + 30) + 'px';
        if (multiplier) p.innerText = multiplier;
        machine.appendChild(p);

        await gsap.to(p, {
            left: (tRect.left - mRect.left + 30),
            top: (tRect.top - mRect.top + 30),
            duration: 0.5,
            ease: "power2.in"
        });
        p.remove();
    }
};
