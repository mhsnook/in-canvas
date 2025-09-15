'use client'

import type React from 'react'

import { useState } from 'react'
import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Play, Pause, MessageCircle, Edit2, Check, X } from 'lucide-react'

interface CanvasItemProps {
	item: {
		id: string
		type: 'voice' | 'image'
		x: number
		y: number
		content: string
		caption?: string
		comments: Array<{
			id: string
			author: string
			text: string
			timestamp: Date
		}>
		duration?: number
		isPlaying?: boolean
	}
	isSelected: boolean
	onClick: () => void
	onCommentClick: () => void
	onCaptionUpdate: (caption: string) => void
}

export default function CanvasItem({
	item,
	isSelected,
	onClick,
	onCommentClick,
	onCaptionUpdate,
}: CanvasItemProps) {
	const [isPlaying, setIsPlaying] = useState(false)
	const [isEditingCaption, setIsEditingCaption] = useState(false)
	const [captionText, setCaptionText] = useState(item.caption || '')

	const handlePlay = (e: React.MouseEvent) => {
		e.stopPropagation()
		setIsPlaying(!isPlaying)
	}

	const handleCaptionEdit = (e: React.MouseEvent) => {
		e.stopPropagation()
		setIsEditingCaption(true)
	}

	const handleCaptionSave = (e: React.MouseEvent) => {
		e.stopPropagation()
		onCaptionUpdate(captionText)
		setIsEditingCaption(false)
	}

	const handleCaptionCancel = (e: React.MouseEvent) => {
		e.stopPropagation()
		setCaptionText(item.caption || '')
		setIsEditingCaption(false)
	}

	const formatDuration = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	return (
		<Card
			className={`absolute cursor-pointer transition-all duration-200 ${
				isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
			} ${item.type === 'voice' ? 'bg-card' : 'bg-background'}`}
			style={{ left: item.x, top: item.y }}
			onClick={onClick}
		>
			{item.type === 'voice' ? (
				<div className="p-4 w-64">
					<div className="flex items-center gap-3 mb-3">
						<Button
							size="sm"
							variant={isPlaying ? 'secondary' : 'default'}
							onClick={handlePlay}
							className="w-10 h-10 rounded-full p-0"
						>
							{isPlaying ? (
								<Pause className="w-4 h-4" />
							) : (
								<Play className="w-4 h-4" />
							)}
						</Button>
						<div className="flex-1">
							<div className="h-2 bg-muted rounded-full overflow-hidden">
								<div
									className="h-full bg-primary transition-all duration-300"
									style={{ width: isPlaying ? '60%' : '0%' }}
								/>
							</div>
							{item.duration && (
								<div className="text-xs text-muted-foreground mt-1">
									{formatDuration(item.duration)}
								</div>
							)}
						</div>
					</div>

					<div className="mb-3">
						{isEditingCaption ? (
							<div className="flex gap-2">
								<Input
									value={captionText}
									onChange={(e) => setCaptionText(e.target.value)}
									className="text-sm"
									placeholder="Add caption..."
								/>
								<Button size="sm" onClick={handleCaptionSave}>
									<Check className="w-3 h-3" />
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={handleCaptionCancel}
								>
									<X className="w-3 h-3" />
								</Button>
							</div>
						) : (
							<div className="flex items-center gap-2">
								<p className="text-sm text-foreground flex-1">
									{item.caption}
								</p>
								<Button
									size="sm"
									variant="ghost"
									onClick={handleCaptionEdit}
								>
									<Edit2 className="w-3 h-3" />
								</Button>
							</div>
						)}
					</div>

					<div className="flex items-center justify-between">
						<Badge variant="secondary" className="text-xs">
							Voice Note
						</Badge>
						<Button
							size="sm"
							variant="ghost"
							onClick={(e) => {
								e.stopPropagation()
								onCommentClick()
							}}
							className="text-muted-foreground hover:text-foreground"
						>
							<MessageCircle className="w-4 h-4 mr-1" />
							{item.comments.length}
						</Button>
					</div>
				</div>
			) : (
				<div className="overflow-hidden">
					<img
						src={item.content || '/placeholder.svg'}
						alt={item.caption || 'Canvas image'}
						className="w-full h-48 object-cover"
					/>
					<div className="p-3">
						{isEditingCaption ? (
							<div className="flex gap-2 mb-2">
								<Input
									value={captionText}
									onChange={(e) => setCaptionText(e.target.value)}
									className="text-sm"
									placeholder="Add caption..."
								/>
								<Button size="sm" onClick={handleCaptionSave}>
									<Check className="w-3 h-3" />
								</Button>
								<Button
									size="sm"
									variant="outline"
									onClick={handleCaptionCancel}
								>
									<X className="w-3 h-3" />
								</Button>
							</div>
						) : (
							<div className="flex items-center gap-2 mb-2">
								<p className="text-sm text-foreground flex-1">
									{item.caption}
								</p>
								<Button
									size="sm"
									variant="ghost"
									onClick={handleCaptionEdit}
								>
									<Edit2 className="w-3 h-3" />
								</Button>
							</div>
						)}

						<div className="flex items-center justify-between">
							<Badge variant="outline" className="text-xs">
								Image
							</Badge>
							<Button
								size="sm"
								variant="ghost"
								onClick={(e) => {
									e.stopPropagation()
									onCommentClick()
								}}
								className="text-muted-foreground hover:text-foreground"
							>
								<MessageCircle className="w-4 h-4 mr-1" />
								{item.comments.length}
							</Button>
						</div>
					</div>
				</div>
			)}
		</Card>
	)
}
