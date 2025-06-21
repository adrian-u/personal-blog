export default function createOverview(data) {
    return `
	  <div class="two-column">
	 	<div class="content-card fade-in">
			<h3>
				<span class="icon">💻</span>
				${data.developer.title}
			</h3>
			<p>
				${data.developer.description}
			</p>
		</div>
		<div class="content-card fade-in">
			<h3>
				<span class="icon">💻</span>
				${data.investor.title}
			</h3>
			<p>
				${data.investor.description}
			</p>
		</div> 
	  </div>
	`;
}