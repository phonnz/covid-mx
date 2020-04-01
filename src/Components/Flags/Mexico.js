import React from 'react'

const Spain = (props) => {
    const { cx, cy, stroke, payload, value, childKey } = props;
    return (
        // <svg x={cx - 10} y={cy - 10} width={20} height={20} fill="green" viewBox="0 0 1024 1024">viewBox="0 0 512 512"
        <svg id={childKey} xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x={cx - 10} y={cy - 10} width={30} height={35} viewBox="0 0 1024 1024" style={{ enableBackground: 'new 0 0 512 512' }} >
            <polygon key={0} fill="#D80027" points="341.334,85.33 170.666,85.33 0,85.33 0,426.662 170.666,426.662 341.334,426.662   512,426.662 512,85.33 " />
            <rect key={1} y="85.333" fill="#6DA544" width="170.663" height="341.337" />
            <rect key={2} x="170.663" y="85.333" fill="#F0F0F0" width="170.663" height="341.337" />
            <path key={3} fill="#6DA544" d="M208,255.996c0,26.509,21.491,48,48,48s48-21.491,48-48v-16h-96V255.996z" />
            <path key={4} fill="#FF9811" d="M320,223.996h-48c0-8.836-7.164-16-16-16s-16,7.164-16,16h-48c0,8.836,7.697,16,16.533,16H208  c0,8.836,7.164,16,16,16c0,8.836,7.164,16,16,16h32c8.836,0,16-7.164,16-16c8.836,0,16-7.164,16-16h-0.533  C312.303,239.996,320,232.833,320,223.996z" />
            <g id={5} ></g>
            <g id={6} ></g>
            <g id={7} ></g>
            <g id={8} ></g>
            <g id={9} ></g>
            <g id={10} ></g>
            <g id={11} ></g>
            <g id={12} ></g>
            <g id={13} ></g>
            <g id={14} ></g>
            <g id={15} ></g>
            <g id={16} ></g>
            <g id={17} ></g>
            <g id={18} ></g>
            <g id={19} ></g>
        </svg>
    );
}

export default Spain