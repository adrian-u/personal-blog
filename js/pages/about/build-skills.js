export default function buildSkills(data) {
    return `
	   <h2 class="section-title">Technologies, Investments, and Interests</h2>
	   <div class="skills-grid"> 
	 		<div class="skill-category"> 
				<h4>Frontend Development</h4>
				<div class="skill-tags"> 
					${data.skills.fe.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
				</div>
			</div>
			<div class="skill-category"> 
				<h4>Backend Development</h4>
				<div class="skill-tags"> 
					${data.skills.be.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
				</div>
			</div>
			<div class="skill-category"> 
				<h4>DevOps</h4>
				<div class="skill-tags"> 
					${data.skills.devops.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
				</div>
			</div>
			<div class="skill-category"> 
				<h4>Investment Knowledge</h4>
				<div class="skill-tags"> 
					${data.investments.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
				</div>
			</div>
			<div class="skill-category"> 
				<h4>Interests</h4>
				<div class="skill-tags"> 
					${data.interests.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
				</div>
			</div>
	   </div>
	 `;
}