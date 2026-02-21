/* UI Components — Atomic Design
 * =============================
 * Reusable, domain-agnostic UI primitives.
 * These should have NO business logic.
 * All components consume design tokens via Tailwind utilities only.
 */

// --- Core Primitives ---
export { default as Button } from "./button";
export type { ButtonProps } from "./button";

export { default as Card, CardHeader, CardTitle, CardContent, CardFooter } from "./card";
export type { CardProps, CardHeaderProps, CardTitleProps, CardContentProps, CardFooterProps } from "./card";

export { default as Badge } from "./badge";
export type { BadgeProps } from "./badge";

export { default as Input } from "./input";
export type { InputProps } from "./input";

export { default as Avatar } from "./avatar";
export type { AvatarProps } from "./avatar";

export { default as Skeleton } from "./skeleton";
export type { SkeletonProps } from "./skeleton";

// --- Compound Primitives ---
export { default as Modal } from "./modal";
export type { ModalProps } from "./modal";

export { default as Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table";

export { default as Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps } from "./tabs";

export { default as Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, DropdownSeparator } from "./dropdown";
export type { DropdownProps, DropdownTriggerProps, DropdownMenuProps, DropdownItemProps } from "./dropdown";

export { default as Toast } from "./toast";
export type { ToastProps } from "./toast";

// --- Dashboard Primitives ---
export { default as ProgressRing } from "./progress-ring";
export type { ProgressRingProps } from "./progress-ring";

export { default as SelectionTile } from "./selection-tile";
export type { SelectionTileProps } from "./selection-tile";

export { default as IconTile } from "./icon-tile";
export type { IconTileProps } from "./icon-tile";

export { default as SectionHeader } from "./section-header";
export type { SectionHeaderProps } from "./section-header";

export { default as ToggleGroup, ToggleGroupItem } from "./toggle-group";
export type { ToggleGroupProps, ToggleGroupItemProps } from "./toggle-group";

export { default as AvatarGroup } from "./avatar-group";
export type { AvatarGroupProps, AvatarGroupItem } from "./avatar-group";
