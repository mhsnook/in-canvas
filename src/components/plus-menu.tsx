'use client'

import {
	Camera,
	CheckSquare,
	Lock,
	MessageCircle,
	Mic,
	Plus,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '~/components/ui/button'

interface PlusMenuProps {
	onAddVoiceNote: () => void
	onAddImageNote: () => void
	onAddTextNote: () => void
	onAddTask: () => void
	onAddPrivateNote: () => void
}

export default function PlusMenu({
	onAddVoiceNote,
	onAddImageNote,
	onAddTextNote,
	onAddTask,
	onAddPrivateNote,
}: PlusMenuProps) {
	const [showMenu, setShowMenu] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setShowMenu(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		// The parent div is no longer needed as it is in infinite-canvas.tsx
		// <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
		<div className="relative group" ref={menuRef}>
			<Button
				className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
				onClick={() => setShowMenu(!showMenu)}
				data-plus-button
			>
				<Plus className="w-6 h-6" />
			</Button>

			{showMenu && (
				<div className="plus-menu absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border p-2 space-y-2 z-50">
					<Button
						onClick={onAddVoiceNote}
						variant="ghost"
						size="sm"
						className="w-full justify-start text-blue-600 hover:bg-blue-50"
					>
						<Mic className="w-4 h-4 mr-2" />
						Voice Note
					</Button>
					<Button
						onClick={onAddImageNote}
						variant="ghost"
						size="sm"
						className="w-full justify-start text-pink-600 hover:bg-pink-50"
					>
						<Camera className="w-4 h-4 mr-2" />
						Image note
					</Button>
					<Button
						onClick={onAddTextNote}
						variant="ghost"
						size="sm"
						className="w-full justify-start text-gray-600 hover:bg-gray-50"
					>
						<MessageCircle className="w-4 h-4 mr-2" />
						Text note
					</Button>
					<Button
						onClick={onAddTask}
						variant="ghost"
						size="sm"
						className="w-full justify-start text-purple-600 hover:bg-purple-50"
					>
						<CheckSquare className="w-4 h-4 mr-2" />
						Task
					</Button>
					<Button
						onClick={onAddPrivateNote}
						variant="ghost"
						size="sm"
						className="w-full justify-start text-yellow-600 hover:bg-yellow-50"
					>
						<Lock className="w-4 h-4 mr-2" />
						Private Note
					</Button>
				</div>
			)}
		</div>
		// </div>
	)
}
