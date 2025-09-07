"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Edit3,
	Eye,
	Zap,
	CheckCircle,
	Share2,
	Smartphone,
	ArrowRight,
	Sparkles,
	Download,
} from "lucide-react";

export default function HomePage() {
	const features = [
		{
			icon: Eye,
			title: "Real-time Preview",
			description:
				"See your forms come to life with instant preview in editor, preview, and split-view modes.",
			image: "/api/placeholder/600/400",
		},
		{
			icon: Zap,
			title: "Conditional Logic",
			description:
				"Show or hide fields based on user responses with powerful conditional logic.",
			image: "/api/placeholder/600/400",
			comingSoon: true,
		},
		{
			icon: CheckCircle,
			title: "Smart Validation",
			description:
				"Built-in and custom field validation to ensure data quality and user experience.",
			image: "/api/placeholder/600/400",
		},
		{
			icon: Download,
			title: "Capture & Export",
			description:
				"Collect submissions effortlessly and export your data in multiple formats.",
			image: "/api/placeholder/600/400",
		},
		{
			icon: Share2,
			title: "Publish & Share",
			description:
				"Save your forms and share them instantly via unique, branded URLs.",
			image: "/api/placeholder/600/400",
		},
		{
			icon: Smartphone,
			title: "Mobile-Friendly",
			description:
				"Responsive design that works beautifully across all devices and screen sizes.",
			image: "/api/placeholder/600/400",
		},
	];

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut" as const,
			},
		},
	};

	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						{/* Logo */}
						<Link href="/" className="flex items-center gap-2">
							<div className="p-2 bg-linear-to-br/oklch from-brand-blue/20 to-brand-red/20 rounded-lg transition-transform">
								<Zap className="w-6 h-6 text-brand-red" />
							</div>
							<span className="text-xl font-bold red-gradient bg-clip-text text-transparent">
								PowerForms
							</span>
						</Link>

						{/* Desktop CTA */}
						<div className="hidden md:flex items-center gap-4">
							<Link href="/forms">
								<Button className="red-gradient text-white">Get Started</Button>
							</Link>
						</div>
					</div>
				</div>
			</header>
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
				{/* Hero Section */}
				<section className="relative overflow-hidden">
					{/* Background Effects */}
					<div className="absolute inset-0 bg-linear-to-br/oklch from-brand-blue/20 to-brand-red/10"></div>
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl">
						<div className="absolute top-20 left-10 w-72 h-72 bg-linear-to-br/oklch from-brand-blue/20 to-brand-red/10 rounded-full blur-3xl"></div>
						<div className="absolute bottom-20 right-10 w-96 h-96 bg-linear-to-br/oklch from-brand-blue/20 to-brand-red/10 rounded-full blur-3xl"></div>
					</div>

					<div className="relative container mx-auto px-6 py-24 lg:py-32">
						<motion.div
							initial="hidden"
							animate="visible"
							variants={containerVariants}
							className="text-center max-w-4xl mx-auto"
						>
							<motion.div variants={itemVariants} className="mb-8">
								<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-br/oklch from-brand-blue/20 to-brand-red/10 border border-brand-blue/40 mb-6 bg-white">
									<Sparkles className="w-4 h-4 text-brand-red" />
									<span className="text-sm font-medium text-brand-red">
										Next-gen form builder
									</span>
								</div>
							</motion.div>

							<motion.h1
								variants={itemVariants}
								className="text-5xl lg:text-7xl font-bold bg-linear-to-r/oklch from-slate-900 via-brand-red to-slate-900 bg-clip-text text-transparent mb-6 leading-tight"
							>
								PowerForms
							</motion.h1>

							<motion.p
								variants={itemVariants}
								className="text-xl lg:text-2xl text-slate-600 mb-8 max-w-2xl mx-auto"
							>
								A powerful form builder that transforms how you create, share,
								and manage forms.
							</motion.p>

							<motion.div
								variants={itemVariants}
								className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
							>
								<Link href="/forms">
									<Button
										size="lg"
										className="red-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300 p-2 h-auto text-lg group"
									>
										Start Building
										<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
									</Button>
								</Link>
							</motion.div>

							<motion.div
								variants={itemVariants}
								className="relative max-w-4xl mx-auto"
							>
								<div className="relative bg-gradient-to-br from-white/80 to-slate-100/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
									<div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
										<div className="text-center">
											<Edit3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
											<p className="text-slate-500 text-lg">
												Form Builder Preview
											</p>
											<p className="text-slate-400 text-sm mt-2">
												Interactive demo coming soon
											</p>
										</div>
									</div>
								</div>
							</motion.div>
						</motion.div>
					</div>
				</section>

				{/* Features Section */}
				<section className="py-24 lg:py-32 relative">
					<div className="container mx-auto px-6">
						<motion.div
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							variants={containerVariants}
							className="text-center mb-20"
						>
							<motion.h2
								variants={itemVariants}
								className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6"
							>
								Everything you need to{" "}
								<span className="red-gradient bg-clip-text text-transparent">
									build powerful forms
								</span>
							</motion.h2>
							<motion.p
								variants={itemVariants}
								className="text-xl text-slate-600 max-w-3xl mx-auto"
							>
								From simple contact forms to complex surveys, PowerForms
								provides all the tools you need to create, customize, and deploy
								forms that convert.
							</motion.p>
						</motion.div>

						<div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
							{features.map((feature, index) => (
								<motion.div
									key={feature.title}
									initial="hidden"
									whileInView="visible"
									viewport={{ once: true }}
									variants={itemVariants}
									className={`flex flex-col ${
										index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
									} items-center gap-8`}
								>
									<div className="flex-1 space-y-6">
										<div className="relative">
											<div className="flex items-center gap-4 mb-4">
												<div className="p-3 bg-linear-to-br/oklch from-brand-blue/20 to-brand-red/10 rounded-xl">
													<feature.icon className="w-6 h-6 text-brand-red" />
												</div>
												{feature.comingSoon && (
													<span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-xs font-medium rounded-full border border-orange-200">
														Coming Soon
													</span>
												)}
											</div>
											<h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
												{feature.title}
											</h3>
											<p className="text-lg text-slate-600 leading-relaxed">
												{feature.description}
											</p>
										</div>
									</div>
									<div className="flex-1">
										<div className="relative bg-gradient-to-br from-white/50 to-slate-100/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
											<div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
												<div className="text-center">
													<feature.icon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
													<p className="text-slate-500 text-sm">
														Feature Preview
													</p>
												</div>
											</div>
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* Testimonial Placeholder */}
				{/* <section className="py-24 bg-linear-to-br/oklch from-brand-blue/20 to-brand-red/10"> */}
				{/* 	<div className="container mx-auto px-6"> */}
				{/* 		<motion.div */}
				{/* 			initial="hidden" */}
				{/* 			whileInView="visible" */}
				{/* 			viewport={{ once: true }} */}
				{/* 			variants={containerVariants} */}
				{/* 			className="text-center max-w-4xl mx-auto" */}
				{/* 		> */}
				{/* 			<motion.div */}
				{/* 				variants={itemVariants} */}
				{/* 				className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-white/20" */}
				{/* 			> */}
				{/* 				<div className="flex items-center justify-center mb-6"> */}
				{/* 					<div className="flex gap-1"> */}
				{/* 						{[...Array(5)].map((_, i) => ( */}
				{/* 							<div */}
				{/* 								key={i} */}
				{/* 								className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" */}
				{/* 							></div> */}
				{/* 						))} */}
				{/* 					</div> */}
				{/* 				</div> */}
				{/* 				<blockquote className="text-2xl lg:text-3xl font-medium text-slate-900 mb-6 italic"> */}
				{/* 					&ldquo;Testimonial content will be added here to showcase user */}
				{/* 					feedback and build trust with potential customers.&rdquo; */}
				{/* 				</blockquote> */}
				{/* 				<div className="flex items-center justify-center gap-4"> */}
				{/* 					<div className="w-12 h-12 bg-linear-to-br/oklch from-brand-blue/20 to-brand-red/10 rounded-full"></div> */}
				{/* 					<div className="text-left"> */}
				{/* 						<p className="font-semibold text-slate-900">User Name</p> */}
				{/* 						<p className="text-slate-600">Company Title</p> */}
				{/* 					</div> */}
				{/* 				</div> */}
				{/* 			</motion.div> */}
				{/* 		</motion.div> */}
				{/* 	</div> */}
				{/* </section> */}

				{/* Final CTA Section */}
				<section className="py-24 lg:py-32 relative overflow-hidden">
					<div className="absolute inset-0 bg-linear-to-br/oklch from-brand-blue/20 to-brand-red/10"></div>
					<div className="container mx-auto px-6 relative">
						<motion.div
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							variants={containerVariants}
							className="text-center max-w-4xl mx-auto"
						>
							<motion.h2
								variants={itemVariants}
								className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6"
							>
								Ready to{" "}
								<span className="red-gradient bg-clip-text text-transparent">
									power up
								</span>{" "}
								your forms?
							</motion.h2>
							<motion.p
								variants={itemVariants}
								className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto"
							>
								Join the 3 other people who are already building better forms
								with PowerForms. Start your journey today.
							</motion.p>
							<motion.div
								variants={itemVariants}
								className="flex flex-col sm:flex-row gap-4 justify-center items-center"
							>
								<Link href="/forms">
									<Button
										size="lg"
										className="red-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300 p-2 h-auto text-lg group"
									>
										Start Building
										<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
									</Button>
								</Link>
							</motion.div>
						</motion.div>
					</div>
				</section>
			</div>
		</>
	);
}
