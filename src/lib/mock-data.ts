import type { CanvasItemData } from './types'

export const mockItems: CanvasItemData[] = [
	// Day 1 - January 15 (Dense day with 35+ items)
	{
		id: '1',
		type: 'voice',
		x: 200,
		y: 150,
		content: 'voice-note-1.mp3',
		caption: 'Team meeting notes from Monday',
		duration: 45,
		keywords: ['meeting', 'action items', 'budget', 'timeline', 'team'],
		timestamp: new Date('2024-01-15T09:00:00'),
		julianNotes: 'Need to follow up on the budget approval process',
		author: 'Julian',
		taskItems: [
			{
				id: 't1',
				text: 'Follow up on budget',
				status: 'To do',
				createdAt: new Date('2024-01-15T09:30:00'),
			},
			{
				id: 't2',
				text: 'Schedule next meeting',
				status: 'Done',
				createdAt: new Date('2024-01-15T09:45:00'),
			},
		],
		comments: [
			{
				id: 'c1',
				author: 'Sarah',
				text: 'Great summary of the action items!',
				timestamp: new Date('2024-01-15T10:30:00'),
			},
			{
				id: 'c2',
				author: 'Mike',
				text: 'Can we follow up on the budget discussion?',
				timestamp: new Date('2024-01-15T11:15:00'),
			},
			{
				id: 'c3',
				author: 'Alex',
				text: "I'll prepare the financial projections",
				timestamp: new Date('2024-01-15T11:30:00'),
			},
			{
				id: 'c4',
				author: 'Emma',
				text: 'Should we include Q2 targets?',
				timestamp: new Date('2024-01-15T12:00:00'),
			},
			{
				id: 'c5',
				author: 'David',
				text: 'Yes, definitely include Q2',
				timestamp: new Date('2024-01-15T12:15:00'),
			},
			{
				id: 'c6',
				author: 'Lisa',
				text: 'I can help with the presentation',
				timestamp: new Date('2024-01-15T12:30:00'),
			},
			{
				id: 'c7',
				author: 'Tom',
				text: 'Great idea, Lisa!',
				timestamp: new Date('2024-01-15T12:45:00'),
			},
			{
				id: 'c8',
				author: 'Sarah',
				text: "Let's schedule a follow-up",
				timestamp: new Date('2024-01-15T13:00:00'),
			},
		],
	},
	{
		id: '2',
		type: 'image',
		x: 500,
		y: 200,
		content: '/design-mockup-wireframe.jpg',
		caption: 'Initial wireframe for the new feature',
		timestamp: new Date('2024-01-15T13:30:00'),
		julianNotes: 'Consider mobile-first approach for this design',
		author: 'Alex',
		comments: [
			{
				id: 'c9',
				author: 'Julian',
				text: 'Love the clean layout approach',
				timestamp: new Date('2024-01-15T14:00:00'),
			},
			{
				id: 'c10',
				author: 'Mike',
				text: 'How does this work on mobile?',
				timestamp: new Date('2024-01-15T14:15:00'),
			},
			{
				id: 'c11',
				author: 'Alex',
				text: "I'll create mobile versions next",
				timestamp: new Date('2024-01-15T14:30:00'),
			},
			{
				id: 'c12',
				author: 'Emma',
				text: 'The color scheme looks great',
				timestamp: new Date('2024-01-15T14:45:00'),
			},
			{
				id: 'c13',
				author: 'David',
				text: 'Can we add more contrast?',
				timestamp: new Date('2024-01-15T15:00:00'),
			},
			{
				id: 'c14',
				author: 'Lisa',
				text: 'I agree with David on contrast',
				timestamp: new Date('2024-01-15T15:15:00'),
			},
			{
				id: 'c15',
				author: 'Tom',
				text: 'What about accessibility?',
				timestamp: new Date('2024-01-15T15:30:00'),
			},
			{
				id: 'c16',
				author: 'Sarah',
				text: 'Good point, Tom',
				timestamp: new Date('2024-01-15T15:45:00'),
			},
		],
	},
	{
		id: '3',
		type: 'text',
		x: 300,
		y: 400,
		content:
			'Key insights from user research:\n- Users prefer simplified navigation\n- Mobile usage is increasing\n- Need better onboarding flow',
		timestamp: new Date('2024-01-15T16:00:00'),
		author: 'Emma',
		comments: [
			{
				id: 'c17',
				author: 'Julian',
				text: 'This aligns with our analytics',
				timestamp: new Date('2024-01-15T16:15:00'),
			},
			{
				id: 'c18',
				author: 'Mike',
				text: 'Should we prioritize mobile?',
				timestamp: new Date('2024-01-15T16:30:00'),
			},
			{
				id: 'c19',
				author: 'Alex',
				text: 'Definitely mobile-first',
				timestamp: new Date('2024-01-15T16:45:00'),
			},
			{
				id: 'c20',
				author: 'David',
				text: 'What about the onboarding flow?',
				timestamp: new Date('2024-01-15T17:00:00'),
			},
			{
				id: 'c21',
				author: 'Lisa',
				text: 'I can design new onboarding',
				timestamp: new Date('2024-01-15T17:15:00'),
			},
			{
				id: 'c22',
				author: 'Tom',
				text: "Let's A/B test different flows",
				timestamp: new Date('2024-01-15T17:30:00'),
			},
			{
				id: 'c23',
				author: 'Sarah',
				text: 'Great research, Emma!',
				timestamp: new Date('2024-01-15T17:45:00'),
			},
			{
				id: 'c24',
				author: 'Emma',
				text: 'Thanks everyone for the feedback',
				timestamp: new Date('2024-01-15T18:00:00'),
			},
		],
	},

	// Day 2 - January 16 (Another dense day)
	{
		id: '4',
		type: 'voice',
		x: 200,
		y: 150,
		content: 'voice-note-2.mp3',
		caption: 'Client feedback session recording',
		duration: 120,
		keywords: ['client', 'feedback', 'improvements', 'timeline'],
		timestamp: new Date('2024-01-16T09:00:00'),
		author: 'Sarah',
		comments: [
			{
				id: 'c25',
				author: 'Julian',
				text: 'Valuable client insights here',
				timestamp: new Date('2024-01-16T09:30:00'),
			},
			{
				id: 'c26',
				author: 'Mike',
				text: 'They seem happy with progress',
				timestamp: new Date('2024-01-16T09:45:00'),
			},
			{
				id: 'c27',
				author: 'Alex',
				text: 'Should we implement their suggestions?',
				timestamp: new Date('2024-01-16T10:00:00'),
			},
			{
				id: 'c28',
				author: 'Emma',
				text: 'Most suggestions are feasible',
				timestamp: new Date('2024-01-16T10:15:00'),
			},
			{
				id: 'c29',
				author: 'David',
				text: "What's the timeline impact?",
				timestamp: new Date('2024-01-16T10:30:00'),
			},
			{
				id: 'c30',
				author: 'Lisa',
				text: 'Minimal impact if we prioritize',
				timestamp: new Date('2024-01-16T10:45:00'),
			},
			{
				id: 'c31',
				author: 'Tom',
				text: "Let's create action items",
				timestamp: new Date('2024-01-16T11:00:00'),
			},
			{
				id: 'c32',
				author: 'Sarah',
				text: "I'll draft the action plan",
				timestamp: new Date('2024-01-16T11:15:00'),
			},
		],
	},
	{
		id: '5',
		type: 'image',
		x: 400,
		y: 250,
		content: '/user-interface-mobile-app.jpg',
		caption: 'Mobile app interface concepts',
		timestamp: new Date('2024-01-16T14:00:00'),
		author: 'Lisa',
		comments: [
			{
				id: 'c33',
				author: 'Julian',
				text: 'The mobile design looks fantastic',
				timestamp: new Date('2024-01-16T14:15:00'),
			},
			{
				id: 'c34',
				author: 'Mike',
				text: 'How does navigation work?',
				timestamp: new Date('2024-01-16T14:30:00'),
			},
			{
				id: 'c35',
				author: 'Alex',
				text: 'Clean and intuitive interface',
				timestamp: new Date('2024-01-16T14:45:00'),
			},
			{
				id: 'c36',
				author: 'Emma',
				text: 'Users will love this design',
				timestamp: new Date('2024-01-16T15:00:00'),
			},
			{
				id: 'c37',
				author: 'David',
				text: 'What about dark mode?',
				timestamp: new Date('2024-01-16T15:15:00'),
			},
			{
				id: 'c38',
				author: 'Lisa',
				text: 'Dark mode is in progress',
				timestamp: new Date('2024-01-16T15:30:00'),
			},
			{
				id: 'c39',
				author: 'Tom',
				text: "Can't wait to see dark mode",
				timestamp: new Date('2024-01-16T15:45:00'),
			},
			{
				id: 'c40',
				author: 'Sarah',
				text: 'Excellent work, Lisa!',
				timestamp: new Date('2024-01-16T16:00:00'),
			},
		],
	},

	// Day 3 - January 17 (Dense day with 40+ items)
	{
		id: '6',
		type: 'text',
		x: 300,
		y: 300,
		content:
			'Sprint planning notes:\n- 15 story points committed\n- Focus on mobile optimization\n- Testing framework setup',
		timestamp: new Date('2024-01-17T09:00:00'),
		author: 'Mike',
		comments: [
			{
				id: 'c41',
				author: 'Julian',
				text: 'Realistic sprint goals',
				timestamp: new Date('2024-01-17T09:15:00'),
			},
			{
				id: 'c42',
				author: 'Sarah',
				text: 'Mobile optimization is priority',
				timestamp: new Date('2024-01-17T09:30:00'),
			},
			{
				id: 'c43',
				author: 'Alex',
				text: "I'll handle the testing framework",
				timestamp: new Date('2024-01-17T09:45:00'),
			},
			{
				id: 'c44',
				author: 'Emma',
				text: 'What testing tools are we using?',
				timestamp: new Date('2024-01-17T10:00:00'),
			},
			{
				id: 'c45',
				author: 'David',
				text: 'Jest and Cypress probably',
				timestamp: new Date('2024-01-17T10:15:00'),
			},
			{
				id: 'c46',
				author: 'Lisa',
				text: 'Good choice for testing stack',
				timestamp: new Date('2024-01-17T10:30:00'),
			},
			{
				id: 'c47',
				author: 'Tom',
				text: 'Need help with mobile testing?',
				timestamp: new Date('2024-01-17T10:45:00'),
			},
			{
				id: 'c48',
				author: 'Mike',
				text: 'Yes, Tom, that would be great',
				timestamp: new Date('2024-01-17T11:00:00'),
			},
			{
				id: 'c49',
				author: 'Sarah',
				text: 'Team collaboration is excellent',
				timestamp: new Date('2024-01-17T11:15:00'),
			},
			{
				id: 'c50',
				author: 'Alex',
				text: "Let's crush this sprint!",
				timestamp: new Date('2024-01-17T11:30:00'),
			},
		],
	},
	{
		id: '7',
		type: 'voice',
		x: 600,
		y: 200,
		content: 'voice-note-3.mp3',
		caption: 'Daily standup - progress updates',
		duration: 25,
		keywords: ['standup', 'progress', 'blockers', 'goals'],
		timestamp: new Date('2024-01-17T15:00:00'),
		author: 'David',
		comments: [
			{
				id: 'c51',
				author: 'Julian',
				text: 'Good progress across the board',
				timestamp: new Date('2024-01-17T15:15:00'),
			},
			{
				id: 'c52',
				author: 'Mike',
				text: 'Any blockers we should address?',
				timestamp: new Date('2024-01-17T15:30:00'),
			},
			{
				id: 'c53',
				author: 'Alex',
				text: 'API integration is on track',
				timestamp: new Date('2024-01-17T15:45:00'),
			},
			{
				id: 'c54',
				author: 'Emma',
				text: 'UI components are ready',
				timestamp: new Date('2024-01-17T16:00:00'),
			},
			{
				id: 'c55',
				author: 'David',
				text: 'Database optimization complete',
				timestamp: new Date('2024-01-17T16:15:00'),
			},
			{
				id: 'c56',
				author: 'Lisa',
				text: 'Design system is finalized',
				timestamp: new Date('2024-01-17T16:30:00'),
			},
			{
				id: 'c57',
				author: 'Tom',
				text: 'Testing environment is ready',
				timestamp: new Date('2024-01-17T16:45:00'),
			},
			{
				id: 'c58',
				author: 'Sarah',
				text: 'Great team coordination',
				timestamp: new Date('2024-01-17T17:00:00'),
			},
		],
	},

	// Continue with more days and items...
	// Day 4 - January 18
	{
		id: '8',
		type: 'image',
		x: 450,
		y: 350,
		content: '/new-uploaded-image.jpg',
		caption: 'Final design mockups for review',
		timestamp: new Date('2024-01-18T10:00:00'),
		author: 'Emma',
		comments: [
			{
				id: 'c59',
				author: 'Julian',
				text: 'These look production-ready',
				timestamp: new Date('2024-01-18T10:15:00'),
			},
			{
				id: 'c60',
				author: 'Mike',
				text: 'Client will love these designs',
				timestamp: new Date('2024-01-18T10:30:00'),
			},
			{
				id: 'c61',
				author: 'Alex',
				text: 'Implementation will be smooth',
				timestamp: new Date('2024-01-18T10:45:00'),
			},
			{
				id: 'c62',
				author: 'David',
				text: 'Performance considerations?',
				timestamp: new Date('2024-01-18T11:00:00'),
			},
			{
				id: 'c63',
				author: 'Lisa',
				text: 'Optimized for fast loading',
				timestamp: new Date('2024-01-18T11:15:00'),
			},
			{
				id: 'c64',
				author: 'Tom',
				text: 'Accessibility checks passed',
				timestamp: new Date('2024-01-18T11:30:00'),
			},
			{
				id: 'c65',
				author: 'Sarah',
				text: 'Ready for client presentation',
				timestamp: new Date('2024-01-18T11:45:00'),
			},
			{
				id: 'c66',
				author: 'Emma',
				text: 'Thanks for all the feedback!',
				timestamp: new Date('2024-01-18T12:00:00'),
			},
		],
	},

	// Add more items for remaining days...
	// Days 5-15 with varying amounts of content
	...Array.from({ length: 10 }, (_, dayIndex) => {
		const dayOffset = dayIndex + 5
		const date = new Date(`2024-01-${15 + dayOffset}T09:00:00`)
		const itemsPerDay = Math.floor(Math.random() * 20) + 10 // 10-30 items per day

		return Array.from({ length: itemsPerDay }, (_, itemIndex) => {
			const itemId = `day${dayOffset}_item${itemIndex}`
			const hour = 9 + Math.floor(itemIndex * 0.5)
			const minute = (itemIndex % 2) * 30
			const timestamp = new Date(
				`2024-01-${15 + dayOffset}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`,
			)

			// 80% comments, 20% main content
			if (itemIndex === 0) {
				// First item is always a main content item
				const types = ['voice', 'image', 'text']
				const type = types[Math.floor(Math.random() * types.length)] as
					| 'voice'
					| 'image'
					| 'text'
				const authors = [
					'Julian',
					'Sarah',
					'Mike',
					'Alex',
					'Emma',
					'David',
					'Lisa',
					'Tom',
				]
				const author = authors[Math.floor(Math.random() * authors.length)]

				return {
					id: itemId,
					type,
					x: 200 + Math.random() * 400,
					y: 150 + Math.random() * 300,
					content:
						type === 'voice'
							? `voice-${itemId}.mp3`
							: type === 'image'
								? '/design-mockup.jpg'
								: `Day ${dayOffset} content: ${['Meeting notes', 'Project update', 'Research findings', 'Design feedback'][Math.floor(Math.random() * 4)]}`,
					caption: `${['Important', 'Urgent', 'Review', 'Update'][Math.floor(Math.random() * 4)]} item for day ${dayOffset}`,
					timestamp,
					author,
					duration:
						type === 'voice'
							? Math.floor(Math.random() * 120) + 30
							: undefined,
					keywords:
						type === 'voice'
							? ['meeting', 'update', 'progress']
							: undefined,
					comments: Array.from(
						{ length: Math.floor(Math.random() * 8) + 3 },
						(_, commentIndex) => ({
							id: `${itemId}_comment${commentIndex}`,
							author:
								authors[Math.floor(Math.random() * authors.length)],
							text: [
								'Great point!',
								'I agree with this approach',
								'Can we discuss this further?',
								'Looks good to me',
								'What about the timeline?',
								'This needs more work',
								'Excellent progress',
								"Let's schedule a follow-up",
								'Good catch!',
								'I have some concerns',
								'This is exactly what we need',
								'Well done!',
							][Math.floor(Math.random() * 12)],
							timestamp: new Date(
								timestamp.getTime() + (commentIndex + 1) * 15 * 60000,
							), // 15 min intervals
						}),
					),
				}
			} else {
				// Return null for non-main items since we're generating comments within main items
				return null
			}
		}).filter(Boolean)
	}).flat(),
].filter(Boolean) as CanvasItemData[]
