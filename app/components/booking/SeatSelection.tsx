'use client';

import React, { useState } from 'react';
import { useBookingContext } from '@/lib/context/BookingContext';
import { Seat, SeatRow, SeatMap } from '@/lib/api/events';
import { formatCurrency } from '@/lib/mock/booking-data';

interface SeatSelectionProps {
  seatMap: SeatMap | null;
  isLoadingSeats?: boolean;
}

// Determine seat zone by row index (backend has no zone field; infer from position)
const getZoneByRow = (rowIndex: number, totalRows: number): 'vip' | 'standard' | 'economy' => {
  const ratio = rowIndex / totalRows;
  if (ratio < 0.2) return 'vip';
  if (ratio < 0.6) return 'standard';
  return 'economy';
};

const ZONE_LABELS = { vip: 'VIP', standard: 'Standard', economy: 'Economy' };
const ROW_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Seat color based on status and zone
const getSeatClass = (status: string, isSelectedByUser: boolean, zone: string, isLockedByOther: boolean): string => {
  // 1. Ghế bạn đang giữ (Ưu tiên cao nhất)
  if (isSelectedByUser) {
    return 'bg-amber-500 hover:bg-amber-600 text-white ring-2 ring-amber-400 ring-offset-2 cursor-pointer scale-110 z-10';
  }
  
  // 2. Ghế đã bán
  if (status === 'sold') {
    return 'bg-red-500 text-white cursor-not-allowed shadow-inner opacity-100';
  }
  
  // 3. Ghế người khác đang giữ
  if (status === 'locked' || isLockedByOther) {
    return 'bg-slate-200 text-slate-400 cursor-not-allowed';
  }
  
  // 4. Ghế trống (available) - Hiển thị theo Zone
  if (zone === 'vip') return 'bg-indigo-600 hover:bg-indigo-700 hover:scale-110 text-white cursor-pointer shadow-sm';
  if (zone === 'economy') return 'bg-emerald-500 hover:bg-emerald-600 hover:scale-110 text-white cursor-pointer shadow-sm';
  return 'bg-indigo-300 hover:bg-indigo-400 hover:scale-110 text-white cursor-pointer shadow-sm';
};

export const SeatSelection: React.FC<SeatSelectionProps> = ({ seatMap, isLoadingSeats }) => {
  const { 
    selectedSeatIds, 
    lockSeat, 
    unlockSeat, 
    isLoading,
    refreshSeatMap,
    error: contextError
  } = useBookingContext();
  const [lockingErrors, setLockingErrors] = useState<Map<string, string>>(new Map());

  const handleSeatClick = async (seat: Seat, rowIndex: number, totalRows: number) => {
    const isSelected = selectedSeatIds.includes(seat.id);
    
    // Clear previous error for this seat
    setLockingErrors(prev => { const m = new Map(prev); m.delete(seat.id); return m; });

    if (isSelected) {
      try { await unlockSeat(seat.id); } catch { /* handled in context */ }
      return;
    }

    const zone = getZoneByRow(rowIndex, totalRows);
    try {
      await lockSeat({ ...seat, zone, row_index: rowIndex } as any);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : 'Không thể giữ ghế này';
      setLockingErrors(prev => new Map(prev).set(seat.id, msg));
      
      // Nếu ghế đã bán hoặc có xung đột, tải lại sơ đồ ghế ngay lập tức
      if (msg.includes('đã bán') || msg.includes('Xung đột')) {
        refreshSeatMap();
      }
    }
  };

  // Clear locking errors when seat map is refreshed/updated
  React.useEffect(() => {
    if (seatMap) {
      setLockingErrors(new Map());
    }
  }, [seatMap]);

  // Loading state
  if (isLoadingSeats) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-200 min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-slate-500 font-medium">Đang tải sơ đồ ghế...</p>
        </div>
      </div>
    );
  }

  // No seatmap
  if (!seatMap) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-200 min-h-[300px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <span className="material-symbols-outlined text-5xl text-slate-200">event_seat</span>
          <p className="text-slate-500 font-medium">Không thể tải sơ đồ ghế.</p>
          <p className="text-slate-400 text-sm">Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
        </div>
      </div>
    );
  }

  // Empty seats
  if (!seatMap.seats || seatMap.seats.length === 0) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-200 min-h-[300px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <span className="material-symbols-outlined text-5xl text-slate-200">chair</span>
          <p className="text-slate-500 font-medium">Sự kiện này chưa có ghế nào.</p>
        </div>
      </div>
    );
  }

  const totalRows = seatMap.matrix_config?.total_rows ?? seatMap.seats.length;
  const { stats } = seatMap;

  return (
    <div className="space-y-8">
      {/* Seat Map Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md border border-gray-200 overflow-x-auto">

        {/* Stage */}
        <div className="w-full mb-12 min-w-[300px]">
          <div className="h-5 w-2/3 mx-auto bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-400 rounded-full blur-lg mb-2 opacity-70"></div>
          <div className="h-1.5 w-1/3 mx-auto bg-indigo-600 rounded-full shadow"></div>
          <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mt-3">
            Sân Khấu / Stage
          </p>
        </div>

        {/* Zone Legend */}
        <div className="flex flex-wrap justify-center gap-5 mb-8 text-xs">
          {[
            { color: 'bg-indigo-600', label: 'VIP (hàng đầu)' },
            { color: 'bg-indigo-300', label: 'Standard' },
            { color: 'bg-emerald-500', label: 'Economy' },
            { color: 'bg-amber-500', label: 'Bạn đang giữ' },
            { color: 'bg-slate-200', label: 'Đã giữ (người khác)' },
            { color: 'bg-red-500', label: 'Đã bán' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-sm ${color}`}></div>
              <span className="text-slate-600 font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* Seat Grid */}
        <div className="flex flex-col items-center gap-2 min-w-max mx-auto">
          {seatMap.seats.map((seatRow: SeatRow) => {
            const zone = getZoneByRow(seatRow.row_index, totalRows);
            const rowLabel = ROW_LABELS[seatRow.row_index] ?? `R${seatRow.row_index + 1}`;

            return (
              <div key={seatRow.row_index} className="flex items-center gap-2">
                {/* Row label */}
                <span className="w-5 text-[11px] font-bold text-slate-400 text-right flex-shrink-0 select-none">
                  {rowLabel}
                </span>

                {/* Seats */}
                <div className="flex gap-1.5">
                  {seatRow.seats
                    .slice()
                    .sort((a, b) => a.col_index - b.col_index)
                    .map((seat: Seat) => {
                      const isSelected = selectedSeatIds.includes(seat.id);
                      const isSold = seat.status === 'sold';
                      const isLockedByOther = seat.status === 'locked' && !seat.locked_by_user;
                      const seatClass = getSeatClass(seat.status, isSelected, zone, isLockedByOther);

                      return (
                        <button
                          key={seat.id}
                          type="button"
                          disabled={isSold || isLockedByOther || (isLoading && !isSelected)}
                          onClick={() => handleSeatClick(seat, seatRow.row_index, totalRows)}
                          title={`${rowLabel}${seat.col_index + 1} — ${formatCurrency(seat.price)}${isSelected ? ' (đang giữ)' : ''}`}
                          className={`
                            w-7 h-7 rounded-md transition-all duration-150 flex-shrink-0
                            text-[10px] font-bold
                            ${seatClass}
                          `}
                        >
                          {seat.col_index + 1}
                        </button>
                      );
                    })}
                </div>

                {/* Zone tag at end of each first row of zone */}
                <span className={`
                  ml-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0
                  ${zone === 'vip' ? 'bg-indigo-100 text-indigo-600' : zone === 'economy' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}
                `}>
                  {ZONE_LABELS[zone]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-6 text-sm flex-wrap">
              <div>
                <span className="text-indigo-400 font-bold uppercase text-[10px] tracking-wider">Trống</span>
                <p className="text-2xl font-black text-indigo-600">{stats.available}</p>
              </div>
              <div>
                <span className="text-yellow-500 font-bold uppercase text-[10px] tracking-wider">Đang giữ</span>
                <p className="text-2xl font-black text-yellow-600">{stats.locked}</p>
              </div>
              <div>
                <span className="text-red-400 font-bold uppercase text-[10px] tracking-wider">Đã bán</span>
                <p className="text-2xl font-black text-red-500">{stats.sold}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Tổng</span>
                <p className="text-2xl font-black text-slate-600">{stats.total}</p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">Bạn đang giữ</p>
              <p className="text-3xl font-black text-yellow-600">{selectedSeatIds.length}</p>
            </div>
          </div>
          <div className="w-full bg-indigo-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-700"
              style={{ width: `${stats.total > 0 ? ((stats.sold + stats.locked) / stats.total) * 100 : 0}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-indigo-400 mt-1 text-right font-medium">
            {stats.total > 0 ? Math.round(((stats.sold + stats.locked) / stats.total) * 100) : 0}% ghế đã được đặt
          </p>
        </div>
      )}
    </div>
  );
};
