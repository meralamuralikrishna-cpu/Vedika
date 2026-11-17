import { useRef, useCallback, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { ElementVisual } from './ElementVisual';
import { cn, clamp } from '@/lib/utils';
export function CanvasItem({ element, selected, zoom, density, onSelect, onChange, onDelete, onInteractionStart, canvasWidth, canvasHeight, }) {
    const modeRef = useRef(null);
    const pointerIdRef = useRef(null);
    const stopRef = useRef(null);
    const startRef = useRef({
        mx: 0,
        my: 0,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        rot: 0,
    });
    const begin = useCallback((mode, e) => {
        e.stopPropagation();
        e.preventDefault();
        onSelect(element.id);
        onInteractionStart?.();
        modeRef.current = mode;
        pointerIdRef.current = e.pointerId;
        startRef.current = {
            mx: e.clientX,
            my: e.clientY,
            x: element.x,
            y: element.y,
            w: element.width,
            h: element.height,
            rot: element.rotation,
        };
        const onMove = (ev) => {
            if (!modeRef.current || ev.pointerId !== pointerIdRef.current)
                return;
            const dx = (ev.clientX - startRef.current.mx) / zoom;
            const dy = (ev.clientY - startRef.current.my) / zoom;
            if (modeRef.current === 'move') {
                onChange({
                    ...element,
                    x: clamp(startRef.current.x + dx, 0, canvasWidth - element.width),
                    y: clamp(startRef.current.y + dy, 0, canvasHeight - element.height),
                });
            }
            else if (modeRef.current === 'resize') {
                onChange({
                    ...element,
                    width: clamp(startRef.current.w + dx, 40, canvasWidth - element.x),
                    height: clamp(startRef.current.h + dy, 30, canvasHeight - element.y),
                });
            }
            else if (modeRef.current === 'rotate') {
                const angle = startRef.current.rot + dx * 0.5;
                onChange({ ...element, rotation: Math.round(angle) % 360 });
            }
        };
        const onUp = () => {
            modeRef.current = null;
            pointerIdRef.current = null;
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
            stopRef.current = null;
        };
        stopRef.current = onUp;
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
    }, [element, onSelect, onChange, onInteractionStart, zoom, canvasWidth, canvasHeight]);
    useEffect(() => () => {
        stopRef.current?.();
        modeRef.current = null;
        pointerIdRef.current = null;
    }, []);
    return (<div role="button" tabIndex={0} aria-label={`${element.name}, selected: ${selected}`} aria-pressed={selected} className={cn('absolute select-none touch-none group', selected ? 'z-50' : 'z-10')} style={{
            left: element.x,
            top: element.y,
            width: element.width,
            height: element.height,
            transform: `rotate(${element.rotation}deg)`,
            zIndex: selected ? 1000 : element.zIndex,
        }} onPointerDown={(e) => begin('move', e)} onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(element.id);
            }
        }}>
      <div className={cn('w-full h-full rounded-lg transition-shadow', selected && 'ring-2 ring-champagne ring-offset-2 ring-offset-transparent shadow-lg')}>
        <ElementVisual element={element} density={density}/>
      </div>

      {selected && (<>
          <span className="absolute -top-6 left-0 text-[10px] font-medium text-forest bg-ivory/90 px-1.5 py-0.5 rounded whitespace-nowrap max-w-[70%] truncate">
            {element.name}
          </span>
          <button type="button" aria-label={`Delete ${element.name}`} title="Delete" className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-red-700 text-white border-2 border-white shadow flex items-center justify-center hover:bg-red-800 cursor-pointer" onPointerDown={(e) => {
                e.stopPropagation();
            }} onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete?.(element.id);
            }}>
            <Trash2 className="h-3 w-3"/>
          </button>
          <button type="button" aria-label="Resize element" className="absolute -right-2 -bottom-2 h-7 w-7 rounded-full bg-champagne border-2 border-white cursor-se-resize" onPointerDown={(e) => begin('resize', e)}/>
          <button type="button" aria-label="Rotate element" className="absolute left-1/2 -top-3 -translate-x-1/2 h-7 w-7 rounded-full bg-forest border-2 border-white cursor-grab" onPointerDown={(e) => begin('rotate', e)}/>
        </>)}
    </div>);
}
