import clan from "../../../assets/images/clan-id.png";
import almaviva from "../../../assets/images/almaviva.png";
import java from "../../../assets/images/java.png";

export const aboutData = {
    descriptions: {
        developer: "I'm a passionate full-stack developer with over 5 years of experience building scalable web applications and mobile solutions. My journey started with a curiosity about how websites work, which quickly evolved into a deep love for creating digital experiences that solve real-world problems. I specialize in modern JavaScript frameworks, cloud architecture, and DevOps practices. Whether it's building a complex SaaS platform or optimizing database performance, I approach every project with attention to detail and a focus on user experience. My development philosophy centers around writing clean, maintainable code and staying current with emerging technologies while maintaining a strong foundation in computer science fundamentals.",
        investor: "Three years ago, I discovered the world of investing and was immediately drawn to the analytical and strategic aspects of building wealth. What started as curiosity about the stock market has evolved into a comprehensive investment strategy spanning multiple asset classes. I focus on long-term value investing, combining fundamental analysis with technical indicators. My portfolio includes dividend growth stocks, real estate investment trusts (REITs), and a small allocation to cryptocurrency and DeFi protocols. I believe in the power of compound interest and dollar-cost averaging, while constantly educating myself about market trends, economic indicators, and emerging investment opportunities."
    },
    experience: [
        {
            id: 1,
            title: "Software Engineer @ Clan Ingegno Digitale",
            company: "Clan Ingegno Digitale",
            period: "Apr 2024 - Present",
            icon: clan,
            description: "Design and implementation of distributed, secure, and efficient backend systems across industrial IoT and AI-driven environments. Focused on mTLS communication, data synchronization, and integration between Rust-based microservices.",
            subExperiences: []
        },
        {
            id: 2,
            title: "Software Engineer @ ELIS Innovation Hub",
            company: "ELIS Innovation Hub",
            period: "Sep 2021 - Oct 2024",
            icon: almaviva,
            description: "Software engineering for data-driven and enterprise-grade applications within the ELIS Innovation Hub ecosystem. Multiple consultancy projects across industrial, corporate, and IoT domains.",
            subExperiences: []
        },
        {
            id: 3,
            title: "Data Analyst @ ENI",
            company: "ENI",
            period: "May 2020 - Jul 2021",
            icon: clan,
            description: "Data analysis and predictive modeling for industrial and market datasets within the energy sector. Focused on optimizing performance, forecasting trends, and applying ML techniques for sustainability insights.",
            subExperiences: [
                {
                    title: "Data Analyst @ ENI",
                    icon: clan,
                    period: "Mar 2021 - Jul 2021",
                    description: "Analysis of parameters from turbine sensor networks to enhance the predictive efficiency of existing energy models. Designed and validated machine learning algorithms for anomaly detection and performance forecasting across multiple plants.",
                    technologies: [
                        { name: "Python", icon: null },
                        { name: "Java", icon: java },
                        { name: "Pandas 🐼", icon: null },
                        { name: "TensorFlow 🔶", icon: null },
                        { name: "Scikit-Learn 🔬", icon: null },
                        { name: "LSTM 🔴", icon: null }
                    ]
                },
                {
                    title: "Data Analyst @ ENI — Eurostat Market Study",
                    icon: almaviva,
                    period: "May 2020 - Aug 2020",
                    description: "Processed and analyzed Eurostat datasets to examine the correlation between sustainable development indicators and Brent crude oil pricing across EU28 markets. Implemented multiple regression models to evaluate long-term sustainability factors influencing market trends.",
                    technologies: [
                        { name: "Python", icon: null },
                        { name: "Java", icon: java },
                        { name: "Pandas 🐼", icon: null },
                        { name: "TensorFlow 🔶", icon: null },
                        { name: "Scikit-Learn 🔬", icon: null },
                        { name: "LSTM 🔴", icon: null }
                    ]
                }
            ]
        }
    ],
    techStack: [
        { name: "Java SE / EE", icon: "☕", category: "backend" },
        { name: "Spring Boot", icon: "🍃", category: "backend" },
        { name: "Python", icon: "🐍", category: "backend" },
        { name: "C", icon: "©️", category: "systems" },
        { name: "C++", icon: "➕", category: "systems" },
        { name: "C#", icon: "♯", category: "backend" },
        { name: "Rust", icon: "🦀", category: "systems" },
        { name: "Docker", icon: "🐳", category: "devops" },
        { name: "Angular", icon: "🅰️", category: "frontend" },
        { name: "JavaScript", icon: "💛", category: "frontend" },
        { name: "MySQL / SQLite / MongoDB", icon: "🗄️", category: "database" }
    ]
};