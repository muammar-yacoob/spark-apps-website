"use client";

// Specialized AI wand components + comparison table

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { _baseUrl, _headers } from "./spark-ai";
import { AiWand, DismissBtn, Tip, WandBtn, useAi, useTip } from "./spark-ai";

// ── ComparisonTablePanel ───────────────────────────────────────────────────

interface ComparisonResponse {
	html: string;
	markdown: string;
	csv: string;
}

export function ComparisonTablePanel({
	data,
	onClose,
}: {
	data: ComparisonResponse;
	onClose: () => void;
}) {
	const [copiedFmt, setCopiedFmt] = useState<string | null>(null);

	const copy = (fmt: "md" | "csv") => {
		const text = fmt === "md" ? data.markdown : data.csv;
		if (text) navigator.clipboard.writeText(text);
		setCopiedFmt(fmt);
		setTimeout(() => setCopiedFmt(null), 1500);
	};

	return createPortal(
		<>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop */}
			<div
				style={{
					position: "fixed",
					inset: 0,
					zIndex: 9998,
					background: "rgba(0,0,0,0.5)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
				onClick={onClose}
			/>
			<div
				style={{
					position: "fixed",
					zIndex: 9999,
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "fit-content",
					minWidth: 320,
					maxWidth: "92vw",
					maxHeight: "80vh",
					overflowY: "auto",
					background: "linear-gradient(160deg, rgba(13,17,28,0.98), rgba(17,12,30,0.98))",
					border: "1px solid rgba(168,85,247,0.12)",
					borderRadius: 10,
					boxShadow: "0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.3)",
					padding: "10px 14px",
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: 8,
						paddingBottom: 6,
						borderBottom: "1px solid rgba(168,85,247,0.1)",
					}}
				>
					<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
						<img
							src={`${_baseUrl}/favicon.png`}
							alt=""
							style={{ width: 18, height: 18, borderRadius: 4 }}
						/>
						<span style={{ fontWeight: 600, color: "#e2e0ff", fontSize: 11 }}>Spark AI</span>
					</div>
					<button
						type="button"
						onClick={onClose}
						style={{
							background: "none",
							border: "none",
							color: "#6b7280",
							cursor: "pointer",
							fontSize: 14,
							padding: 2,
							lineHeight: 1,
						}}
					>
						{"\u2715"}
					</button>
				</div>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: server-rendered comparison table */}
				<div dangerouslySetInnerHTML={{ __html: data.html }} />
				<div style={{ display: "flex", gap: 4, justifyContent: "flex-end", marginTop: 6 }}>
					<button type="button" className="comparison-copy-btn" onClick={() => copy("md")}>
						{copiedFmt === "md" ? "\u2713 Copied" : "Markdown"}
					</button>
					<button type="button" className="comparison-copy-btn" onClick={() => copy("csv")}>
						{copiedFmt === "csv" ? "\u2713 Copied" : "CSV"}
					</button>
				</div>
			</div>
		</>,
		document.body,
	);
}

// ── AiConfirmWand ───────────────────────────────────────────────────────────

export function AiConfirmWand({
	prompt,
	onResult,
	message,
	tooltip = "Confirm to proceed",
	proceedTooltip = "Proceed",
}: {
	prompt: string | ((value: string) => string);
	onResult: (t: string) => void;
	message: string;
	tooltip?: string;
	proceedTooltip?: string;
}) {
	const [open, setOpen] = useState(false);
	if (!open) return <WandBtn onClick={() => setOpen(true)} color="amber" title={tooltip} />;
	return (
		<span className="inline-flex items-center gap-1.5">
			<span className="text-[10px] text-amber-400/80">{message}</span>
			<AiWand
				tooltip={proceedTooltip}
				prompt={prompt}
				onResult={(t) => {
					onResult(t);
					setOpen(false);
				}}
			/>
			<DismissBtn onClick={() => setOpen(false)} />
		</span>
	);
}

// ── AiRephraseWand ──────────────────────────────────────────────────────────

export const AiRephraseWand = ({
	value,
	onChange,
	className,
}: { value: string; onChange: (v: string) => void; className?: string }) => {
	const { available, loading, action } = useAi();
	const tip = useTip();
	const [error, setError] = useState<string | null>(null);
	useEffect(() => tip.cleanup, [tip]);

	if (available === null) return null;

	const fire = async () => {
		setError(null);
		const r = await action<string>("rephrase", { value });
		if (!r) setError("AI request failed");
		else onChange(String(r.result));
	};

	return (
		<div className={`relative inline-flex items-center ${className ?? ""}`}>
			{(error || tip.s !== "hidden") && (
				<Tip state={error ? "in" : tip.s}>
					{error ? (
						<span className="text-[10px] text-red-400">{error}</span>
					) : (
						<span className="text-[10px] text-gray-300">Rephrase professionally</span>
					)}
				</Tip>
			)}
			<WandBtn
				onClick={fire}
				onMouseEnter={tip.show}
				onMouseLeave={tip.hide}
				disabled={loading || !available}
				loading={loading}
			/>
		</div>
	);
};

// ── AiLimitsWand ────────────────────────────────────────────────────────────

export const AiLimitsWand = ({
	plans,
	appName,
	onResult,
	tooltip = "Infer plan limits with AI",
}: {
	plans: { name: string; price: string }[];
	appName: string;
	onResult: (limits: Record<string, string[]>) => void;
	tooltip?: string;
}) => {
	const { available, loading, action } = useAi();
	const tip = useTip();
	useEffect(() => tip.cleanup, [tip]);

	if (available === null) return null;

	const fire = async () => {
		const r = await action<Record<string, string[]>>("infer-limits", { appName, plans });
		if (r?.type === "json") onResult(r.result);
	};

	return (
		<div className="relative inline-flex items-center">
			{tip.s !== "hidden" && (
				<Tip state={tip.s}>
					<span className="text-[10px] text-gray-300">{tooltip}</span>
				</Tip>
			)}
			<WandBtn
				onClick={fire}
				onMouseEnter={tip.show}
				onMouseLeave={tip.hide}
				disabled={loading || !available}
				loading={loading}
			/>
		</div>
	);
};

// ── AiComparisonWand ────────────────────────────────────────────────────────

export function AiComparisonWand({
	appName,
	domain,
	tooltip = "Compare with competitors",
}: {
	appName: string;
	domain?: string;
	tooltip?: string;
}) {
	useAi();
	const [data, setData] = useState<ComparisonResponse | null>(null);
	const [showDialog, setShowDialog] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const tip = useTip();

	const fire = async () => {
		if (busy) return;
		if (data?.html) {
			setShowDialog(true);
			return;
		}
		setBusy(true);
		setError(null);
		try {
			const res = await fetch(`${_baseUrl}/api/ai/competitor-search`, {
				method: "POST",
				headers: _headers(),
				body: JSON.stringify({ appName, ...(domain && { domain }) }),
			}).catch(() => null);
			if (res?.ok) {
				const d = await res.json();
				if (!d.html) {
					setError("No comparison data");
					return;
				}
				setData(d);
				setShowDialog(true);
				return;
			}
			setError("Could not find competitor data");
		} finally {
			setBusy(false);
		}
	};

	useEffect(() => tip.cleanup, [tip]);

	return (
		<div className="relative inline-flex items-center gap-1.5">
			<WandBtn
				onClick={fire}
				onMouseEnter={tip.show}
				onMouseLeave={tip.hide}
				disabled={busy}
				loading={busy}
			/>
			{tip.s !== "hidden" && !showDialog && !error && (
				<Tip state={tip.s}>
					<span className="text-[10px] text-gray-300">{tooltip}</span>
				</Tip>
			)}
			{error && (
				<span className="inline-flex items-center gap-1">
					<span className="text-[10px] text-red-400/90">{error}</span>
					<DismissBtn onClick={() => setError(null)} />
				</span>
			)}
			{showDialog && data && (
				<ComparisonTablePanel data={data} onClose={() => setShowDialog(false)} />
			)}
		</div>
	);
}

// ── AiReviseFeatures ────────────────────────────────────────────────────────

export const AiReviseFeatures = ({
	planName,
	features,
	onResult,
	tooltip = "Revise features with AI",
}: {
	planName: string;
	features: string[];
	onResult: (revised: string[]) => void;
	tooltip?: string;
}) => {
	const { available, loading, action } = useAi();
	const tip = useTip();
	useEffect(() => tip.cleanup, [tip]);

	if (available === null) return null;

	const fire = async () => {
		const r = await action<string[]>("revise-features", { planName, features });
		if (r?.type === "json") onResult(r.result);
	};

	return (
		<div className="relative inline-flex items-center">
			{tip.s !== "hidden" && (
				<Tip state={tip.s}>
					<span className="text-[10px] text-gray-300">{tooltip}</span>
				</Tip>
			)}
			<WandBtn
				onClick={fire}
				onMouseEnter={tip.show}
				onMouseLeave={tip.hide}
				disabled={loading || !available}
				loading={loading}
			/>
		</div>
	);
};
