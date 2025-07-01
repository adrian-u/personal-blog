export default function buildTimeline(data) {
    return `
	 	<h2 class="section-title">Timeline</h2>
	 	<div class="timeline">
		 ${data.timeline
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .map((timeline, idx) => {
                const positionClass = idx % 2 === 0 ? 'top' : 'bottom';
                return `
			  <div class="timeline-item ${positionClass}">
				<div class="timeline-dot"></div>
				<div class="timeline-content">
				  <div class="timeline-date">${timeline.start}</div>
				  <h3 class="timeline-title">${timeline.title}</h3>
				  ${timeline.company ? `<h4>${timeline.company}</h4>` : ''}
				  <p class="timeline-description">${timeline.description}</p>
				</div>
			  </div>
			`
            }).join('')}
		</div> 
	`;
}
