<script>
	export let progress = 0;

	let show = false;
	let animationDuration = 250;

	const check = () => {
		if (progress == 100) {
			setTimeout(() => {
				animationDuration = 20;
				show = false;
				progress = 0;

				setTimeout(() => {
					animationDuration = 250;
				}, 10);
			}, 500);
		}
	};

	$: progress, check();
</script>

<div
	class="loading_bar"
	style="width: {progress}%; transition: all  ease {animationDuration}ms;"
/>

<!-- {#if show}
    <div class="loading_bar" style="width: {progress}%;"></div>
{/if} -->
