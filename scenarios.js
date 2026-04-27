/**
 * MG Slot 動作指令引擎
 * 這裡定義了所有基礎動作，你可以透過網頁介面自由組合它們
 */
const Scenarios = {
    
    // 基礎工具：取得物件位置
    getPos: (id) => {
        const el = document.getElementById(id);
        const machine = document.getElementById('machine');
        if (!el || !machine) return { x: 0, y: 0 };
        const eRect = el.getBoundingClientRect();
        const mRect = machine.getBoundingClientRect();
        return {
            x: eRect.left - mRect.left,
            y: tRect = eRect.top - mRect.top,
            width: eRect.width,
            height: eRect.height
        };
    },

    // 1. Nudge 推動輪軸
    // 參數: reelIndex (0-4), intensity (震動強度)
    nudge: (reelIndex, intensity = 15) => {
        const reel = document.getElementById(`reel-${reelIndex}`);
        if (!reel) return;
        console.log(`執行指令: Nudge Reel ${reelIndex}`);
        return gsap.to(reel, { 
            y: intensity, 
            duration: 0.1, 
            yoyo: true, 
            repeat: 5, 
            ease: "power1.inOut" 
        });
    },

    // 2. Launch 發射粒子 (不帶常駐框)
    // 參數: targetId (如 's-1-1'), multiplier (文字)
    launch: async (targetId, multiplier = "") => {
        const machine = document.getElementById('machine');
        const target = document.getElementById(targetId);
        const reelCount = parseInt(document.getElementById('reels').value);
        const rowCount = parseInt(document.getElementById('rows').value);
        const source = document.getElementById(`s-${reelCount-1}-${rowCount-1}`);

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
            ease: "back.out(1.2)"
        });
        p.remove();
        return gsap.to(target, { scale: 1.2, duration: 0.1, yoyo: true, repeat: 1 });
    },

    // 3. Shake 盤面震動
    // 參數: duration (秒)
    shake: (duration = 0.5) => {
        console.log("執行指令: 盤面震動");
        return gsap.to('#machine', { 
            x: 8, 
            duration: 0.05, 
            yoyo: true, 
            repeat: Math.floor(duration / 0.05) 
        });
    },

    // 4. Flash 符號閃爍 (強調規格)
    // 參數: targetId
    flash: (targetId) => {
        const el = document.getElementById(targetId);
        if (!el) return;
        return gsap.to(el, { 
            backgroundColor: "#00f2fe", 
            filter: "brightness(2)",
            duration: 0.2, 
            yoyo: true, 
            repeat: 3 
        });
    },

    // 5. 既有的常駐框邏輯 (為了相容舊選單)
    stickyCollect: async (targetId, machineId, sourceId, isMultiplier) => {
        // ... (保留之前的代碼，讓舊按鈕能跑) ...
        await Scenarios.launch(targetId, isMultiplier ? "X5" : "");
        const target = document.getElementById(targetId);
        const machine = document.getElementById(machineId);
        const tRect = target.getBoundingClientRect();
        const mRect = machine.getBoundingClientRect();

        const frame = document.createElement('div');
        frame.className = 'sticky-frame';
        frame.style.left = (tRect.left - mRect.left) + 'px';
        frame.style.top = (tRect.top - mRect.top) + 'px';
        if (isMultiplier) frame.innerHTML = `<div class="mult-tag">X5</div>`;
        machine.appendChild(frame);
        gsap.to(frame, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out" });
    }
};
