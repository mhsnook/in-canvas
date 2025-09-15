'use client'

import { Button } from '~/components/ui/button'
import { Camera, Edit2 } from 'lucide-react'
import type { CanvasItemData } from '~/lib/types'

interface ImageCardProps {
	item: CanvasItemData
	formatTime: (date: Date) => string
	onEdit: (item: CanvasItemData) => void
}

export default function ImageCard({
	item,
	formatTime,
	onEdit,
}: ImageCardProps) {
	return (
		<div className="bg-pink-200 rounded-xl p-3 text-pink-900 shadow-md relative group">
			<Button
				onClick={() => onEdit(item)}
				variant="ghost"
				size="sm"
				className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-pink-300 hover:bg-pink-400 text-pink-900 h-6 w-6 p-0"
			>
				<Edit2 className="w-3 h-3" />
			</Button>
			<div className="flex items-center gap-2 mb-2">
				<Camera className="w-4 h-4" />
				<span className="text-xs font-medium">{item.author}</span>
				<span className="text-xs opacity-70">
					{formatTime(item.timestamp)}
				</span>
			</div>
			<div className="w-full h-24 bg-pink-300 rounded-lg mb-2 flex items-center justify-center">
				<Camera className="w-6 h-6 opacity-50" />
			</div>
			<p className="text-sm font-medium">{item.caption}</p>
			{item.keywords && item.keywords.length > 0 && (
				<div className="flex flex-wrap gap-1 mt-2">
					{item.keywords.map((keyword, i) => (
						<span
							key={i}
							className="text-xs bg-pink-300 px-2 py-0.5 rounded-full"
						>
							{keyword}
						</span>
					))}
				</div>
			)}
		</div>
	)
}
