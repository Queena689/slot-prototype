/**
 * MG Slot 動作指令引擎 - 累加倍數版
 */
const Scenarios = {

    // 1. 核心動作：閃電甩出乘倍框 (支援 X2 -> X4 -> X6 累加)
    // 參數: targetId (目標 ID), addValue (每次增加的倍數)
    throwLightning: async (targetId, addValue = 2) => {
        const machine = document.getElementById('machine');
        const target = document.getElementById(targetId);
        const source = document.getElementById('s-4-2'); // 右下角 Zeus 手

        if (!target || !source) return;

        // --- 累加邏輯開始 ---
        // 尋找是否已經有屬於這個格子的框框
        let existingFrame = machine.querySelector(`.multiplier-frame[data-target="${targetId}"]`);
        let currentMultiplier = 0;

        if (existingFrame) {
            const tag = existingFrame.querySelector('.mult-tag');
            currentMultiplier = parseInt(tag.innerText.replace('X', ''));
        }
        const newMultiplier = currentMultiplier + addValue;
        // --- 累加邏輯結束 ---

        const mRect = machine.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();
        const sRect = source.getBoundingClientRect();

        // 建立閃電粒子
        const bolt = document.createElement('div');
        bolt.className = 'lightning-bolt';
        bolt.innerText = '⚡';
        bolt.style.left = (sRect.left - mRect.left + 20) + 'px';
        bolt.style.top = (sRect.top - mRect.top) + 'px';
        machine.appendChild(bolt);

        const tl = gsap.timeline();
        tl.to(source, { scale: 1.2, filter: 'brightness(2)', duration: 0.1, yoyo: true, repeat: 1 });

        await tl.to(bolt, {
            left: (tRect.left - mRect.left + 20),
            top: (tRect.top - mRect.top + 20),
            rotation: 720,
            scale: 2,
            duration: 0.3,
            ease: "power2.out"
        });
        bolt.remove();

        if (existingFrame) {
            // 更新現有的框框
            const tag = existingFrame.querySelector('.mult-tag');
            tag.innerText = `X${newMultiplier}`;
            // 數字增加的彈跳回饋
            gsap.fromTo(existingFrame, { scale: 1.4 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
        } else {
            // 建立全新的框框
            const frame = document.createElement('div');
            frame.className = 'multiplier-frame';
            frame.setAttribute('data-target', targetId); // 綁定目標 ID 供下次累加辨識
            frame.innerHTML = `<div class="mult-tag">X${newMultiplier}</div>`;
            
            // 【位置調整參數】：
            // 修改 -15 來控制往左偏移量；修改 +5 來控制上下位置
            frame.style.left = (tRect.left - mRect.left - 15) + 'px'; 
            frame.style.top = (tRect.top - mRect.top + 5) + 'px';
            
            machine.appendChild(frame);
            gsap.from(frame, { scale: 2, opacity: 0, duration: 0.3, ease: "back.out(2)" });
        }

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
