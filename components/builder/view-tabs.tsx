import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit3, Eye, Columns2 } from "lucide-react";
import { ViewType } from "@/types/field";

interface ViewTabsProps {
	currentView: ViewType;
	setCurrentView: (view: ViewType) => void;
}

export function ViewTabs({ currentView, setCurrentView }: ViewTabsProps) {
	const handleValueChange = (value: string) => {
		setCurrentView(value as ViewType);
	};

	return (
		<Tabs value={currentView} onValueChange={handleValueChange}>
			<TabsList>
				<TabsTrigger value="editor" className="gap-2">
					<Edit3 className="h-4 w-4" />
					<span className="hidden sm:inline">Editor</span>
				</TabsTrigger>
				<TabsTrigger value="preview" className="gap-2">
					<Eye className="h-4 w-4" />
					<span className="hidden sm:inline">Preview</span>
				</TabsTrigger>
				<TabsTrigger value="split" className="gap-2 hidden lg:flex">
					<Columns2 className="h-4 w-4" />
					<span className="hidden sm:inline">Split View</span>
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}
