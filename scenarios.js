/**
 * MG Slot 動作指令引擎 - 閃電特效版
 */
const Scenarios = {

    // 1. 核心動作：閃電甩出乘倍框
    // 參數: targetId (目標金幣ID), multText (顯示的乘倍如 X2)
    throwLightning: async (targetId, multText = "X2") => {
        const machine = document.getElementById('machine');
        const target = document.getElementById(targetId);
        // 右下角 Zeus 手的座標 s-4-2
        const source = document.getElementById('s-4-2');

        if (!target || !source) return;

        const mRect = machine.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();
        const sRect = source.getBoundingClientRect();

        // Step 1: 建立閃電粒子
        const bolt = document.createElement('div');
        bolt.className = 'lightning-bolt';
        bolt.innerText = '⚡';
        bolt.style.left = (sRect.left - mRect.left + 20) + 'px';
        bolt.style.top = (sRect.top - mRect.top) + 'px';
        machine.appendChild(bolt);

        const tl = gsap.timeline();

        // Step 2: 發射源蓄力動畫
        tl.to(source, { scale: 1.2, filter: 'brightness(2)', duration: 0.1, yoyo: true, repeat: 1 });

        // Step 3: 閃電飛向金幣 (帶有弧度與旋轉)
        await tl.to(bolt, {
            left: (tRect.left - mRect.left + 20),
            top: (tRect.top - mRect.top + 20),
            rotation: 720,
            scale: 2,
            duration: 0.35,
            ease: "power2.out"
        });

        bolt.remove();

        // Step 4: 產生乘倍框
        const frame = document.createElement('div');
        frame.className = 'multiplier-frame';
        frame.innerHTML = `<div class="mult-tag">${multText}</div>`;
        frame.style.left = (tRect.left - mRect.left - 15) + 'px';
        frame.style.top = (tRect.top - mRect.top + 5) + 'px';
        machine.appendChild(frame);

        // Step 5: 命中反饋
        gsap.from(frame, { scale: 2, opacity: 0, duration: 0.3, ease: "back.out(2)" });
        gsap.to(target, { backgroundColor: "rgba(255, 0, 255, 0.2)", duration: 0.1, yoyo: true, repeat: 1 });
        
        // 畫面震動回饋
        return Scenarios.shake(0.2);
    },

    // 2. 基礎動作：盤面震動
    shake: (duration = 0.5) => {
        return gsap.to('#machine', { 
            x: 6, 
            duration: 0.05, 
            yoyo: true, 
            repeat: Math.floor(duration / 0.05),
            ease: "none"
        });
    }
};
