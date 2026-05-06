/**
 * MG Slot 綜合功能庫
 */
const Scenarios = {

    // 1. 閃電累加發射 (針對 image_b08d75)
    throwLightning: async (targetId, addValue = 2) => {
        const machine = document.getElementById('machine');
        const target = document.getElementById(targetId);
        const source = document.getElementById('s-4-2'); // 右下角 Zeus 手

        if (!target || !source) return;

        let existingFrame = machine.querySelector(`.multiplier-frame[data-target="${targetId}"]`);
        let currentMultiplier = 0;
        if (existingFrame) {
            currentMultiplier = parseInt(existingFrame.querySelector('.mult-tag').innerText.replace('X', ''));
        }
        const newMultiplier = currentMultiplier + addValue;

        const mRect = machine.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();
        const sRect = source.getBoundingClientRect();

        const bolt = document.createElement('div');
        bolt.className = 'lightning-bolt'; bolt.innerText = '⚡';
        bolt.style.left = (sRect.left - mRect.left + 20) + 'px';
        bolt.style.top = (sRect.top - mRect.top) + 'px';
        machine.appendChild(bolt);

        await gsap.to(bolt, {
            left: (tRect.left - mRect.left + 20),
            top: (tRect.top - mRect.top + 20),
            rotation: 720, scale: 2, duration: 0.3, ease: "power2.out"
        });
        bolt.remove();

        if (existingFrame) {
            existingFrame.querySelector('.mult-tag').innerText = `X${newMultiplier}`;
            gsap.fromTo(existingFrame, { scale: 1.4 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
        } else {
            const frame = document.createElement('div');
            frame.className = 'multiplier-frame';
            frame.setAttribute('data-target', targetId);
            frame.innerHTML = `<div class="mult-tag">X${newMultiplier}</div>`;
            frame.style.left = (tRect.left - mRect.left - 15) + 'px'; // 往左微調
            frame.style.top = (tRect.top - mRect.top + 5) + 'px';
            machine.appendChild(frame);
            gsap.from(frame, { scale: 2, opacity: 0, duration: 0.3, ease: "back.out(2)" });
        }
        return Scenarios.shake(0.2);
    },

    // 2. 中心擴展 5 格 (破框表演)
    nudgeExpand: async (centerId) => {
        const [_, reelIdx, rowIdx] = centerId.split('-').map(Number);
        const centerSym = document.getElementById(centerId);
        const reel = document.getElementById(`reel-${reelIdx}`);
        if (!centerSym || !reel) return;

        const tl = gsap.timeline();
        tl.to(centerSym, { backgroundColor: "#ffd700", innerText: "COIN", color: "#000", scale: 1.2, duration: 0.2 });

        const offsets = [-1, 1, -2, 2];
        offsets.forEach((offset) => {
            const targetRow = rowIdx + offset;
            let el = document.getElementById(`s-${reelIdx}-${targetRow}`);
            if (!el) { // 破框虛擬生成
                el = document.createElement('div');
                el.className = 'symbol'; el.style.position = 'absolute';
                el.style.width = '100%'; el.style.height = '70px';
                el.style.backgroundColor = '#ffd700'; el.style.top = (targetRow * 74 + 10) + 'px';
                reel.appendChild(el);
            }
            tl.to(el, { backgroundColor: "#ffd700", innerText: "COIN", color: "#000", scale: 1.1, border: "2px solid #fff", boxShadow: "0 0 20px #ffd700", duration: 0.15 }, 0.2 + (Math.abs(offset) * 0.08));
        });
    },

    // 3. 常駐累積 (基礎動作)
    stickyCollect: async (targetId, machineId, sourceId, isMultiplier) => {
        const target = document.getElementById(targetId);
        const machine = document.getElementById(machineId);
        const tRect = target.getBoundingClientRect();
        const mRect = machine.getBoundingClientRect();
        const frame = document.createElement('div');
        frame.className = 'multiplier-frame';
        frame.style.border = "3px solid #00f2fe"; frame.style.boxShadow = "0 0 15px #00f2fe";
        frame.style.left = (tRect.left - mRect.left) + 'px';
        frame.style.top = (tRect.top - mRect.top) + 'px';
        machine.appendChild(frame);
        gsap.from(frame, { scale: 0, duration: 0.4, ease: "back.out" });
    },

    // 基礎：震動
    shake: (duration = 0.5) => {
        return gsap.to('#machine', { x: 6, duration: 0.05, yoyo: true, repeat: Math.floor(duration / 0.05) });
    }
};
