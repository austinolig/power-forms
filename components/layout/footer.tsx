import { Github } from "lucide-react";

export function Footer() {
	return (
		<div className="bg-linear-to-br/oklch from-slate-50 to-brand-blue/5 border-t border-slate-200">
			<div className="flex justify-between container mx-auto text-slate-500 py-8 px-6 text-sm">
				<p>© 2025 PowerForms</p>
				<a
					href="https://github.com/austinolig"
					target="_blank"
					className="flex gap-2 items-center underline underline-offset-4"
				>
					<Github className="w-4 h-4" />
					<span>@austinolig</span>
				</a>
			</div>
		</div>
	);
}
