export type ToastType = 'success' | 'error';

function showToast(message: string, type: ToastType) {
	if (typeof document === 'undefined') return;
	const toast = document.createElement('div');
	toast.textContent = message;
	toast.style.position = 'fixed';
	toast.style.bottom = '20px';
	toast.style.right = '20px';
	toast.style.padding = '8px 12px';
	toast.style.borderRadius = '4px';
	toast.style.color = '#fff';
	toast.style.background = type === 'success' ? '#4caf50' : '#f44336';
	toast.style.zIndex = '1000';
	document.body.appendChild(toast);
	setTimeout(() => {
		toast.style.transition = 'opacity 0.3s';
		toast.style.opacity = '0';
		setTimeout(() => toast.remove(), 300);
	}, 3000);
}

export const toast = {
	success: (msg: string) => showToast(msg, 'success'),
	error: (msg: string) => showToast(msg, 'error'),
};
