import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartItemCardProps {
    image?: string;
    name?: string;
    price?: number | bigint | undefined | any;
    quantity?: number;
    onQuantityChange?: (newQuantity: number) => void;
    onRemove?: () => void;
}

export default function CartItemCard({
    image,
    name,
    price,
    quantity = 1,
    onQuantityChange,
    onRemove
}: CartItemCardProps) {
    const handleDecrease = () => {
        if (quantity > 1 && onQuantityChange) {
            onQuantityChange(quantity - 1);
        }
    };

    const handleIncrease = () => {
        if (onQuantityChange) {
            onQuantityChange(quantity + 1);
        }
    };
    const formatter = new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
    });
    return (
        <div className="flex gap-4 rounded-sm mb-2 bg-white p-4 shadow-none border-none border-neutral-200">
            {/* Image */}
            <div className="h-20 w-20 p-2 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-contain"
                />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between">
                    <div>
                        <h3 className="font-semibold text-sm text-neutral-900 line-clamp-1">
                            {name}
                        </h3>
                        <p className="mt-1 text-lg font-bold text-neutral-900">
                            {formatter.format(Number(price))}
                        </p>
                    </div>

                    {/* Remove Button */}
                    {onRemove && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                            onClick={onRemove}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-neutral-600">Quantity:</span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            onClick={handleDecrease}
                            disabled={quantity <= 1}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium text-neutral-900">
                            {quantity}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 cursor-pointer"
                            onClick={handleIncrease}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}