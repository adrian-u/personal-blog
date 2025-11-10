import clan from "../../../assets/images/clan-id.png";
import almaviva from "../../../assets/images/almaviva.png";
import aifa from "../../../assets/images/aifa.png";
import java from "../../../assets/images/java.png";
import spring from "../../../assets/images/spring.svg";
import html from "../../../assets/images/html.png";
import css from "../../../assets/images/css.png";
import js from "../../../assets/images/js.png";
import react from "../../../assets/images/react.png";
import node_js from "../../../assets/images/node-js.png";
import postgre from "../../../assets/images/postgre.png";
import docker from "../../../assets/images/docker.png";
import mongo_db from "../../../assets/images/MongoDB.png";
import kafka from "../../../assets/images/kafka.svg";
import maven from "../../../assets/images/maven.svg";
import gradle from "../../../assets/images/gradle.svg";
import git from "../../../assets/images/git.svg";
import db from "../../../assets/images/db.svg";
import angularJS from "../../../assets/images/AngularJS.svg";
import tomcat from "../../../assets/images/tomcat.svg";
import atlasReply from "../../../assets/images/atlas-reply.svg";
import logstash from "../../../assets/images/Logstash.svg";

export const aboutData = {
    descriptions: {
        developer: "My journey as a developer started back in 2014, though not as a conscious choice, more like a happy mistake. " +
            "At the time, I was 13 and spent most of my days playing football or video games. " +
            "In Italy, that’s the age when you finish what is called 'scuole medie' and have to choose a 'scuola superiore' for the next five years. " +
            "I didn’t really know what I wanted to do in life, and no one pushed or guided me toward any specific path. " +
            "So, since I was always on my computer, I decided to pick a school that “had something to do with computers 😂.” Little did I know what I was getting into. " +
            "At first, it was tough, I even thought about quitting because programming felt impossible to learn. " +
            "But I didn’t give up. Deep down, I knew there had to be a way, and I started to actually enjoy what I was learning. " +
            "It was the first time I could see myself doing something like this as a future career. Looking back, I’m really glad my younger self didn’t quit. " +
            "Since 2020, I’ve been working as a web developer, and I genuinely love building and learning new things in this ever-changing world. " +
            "There are still tough moments where I question what I’m doing, but I’ve learned those doubts are temporary and I’m definitely not alone in feeling that way. ",

        investor: "At the start of 2020, when I was 20, I signed my first job contract and started earning my own money. " +
            "By the end of that year, I had around €15,000 in my bank account, more than I’d ever had or seen before. " +
            "I was proud, but then a “philosophical” thought hit me: What is money really? What’s it for? How can I use it wisely? What goals can it help me reach? " +
            "Those questions pushed me to start researching and learning about personal finance, markets, and investing... and wow, what a world I discovered 😄. " +
            "What began as curiosity quickly became a genuine passion. My only regret is not starting earlier, because for years I thought finance was just about charts and numbers (probably too many movies to blame for that!). " +
            "Now I know it’s much more than that, it’s a world full of opportunities, strategies, and lessons that anyone can learn from. " +
            "After months of reading and studying, in early 2021 I decided to take my first real step into investing. " +
            "I opened a DEGIRO account and bought my first ETF with €50. Since then, I’ve kept investing regularly (a bit more than €50 now 😂) and have developed my own investing strategy, one that fits me best among the endless possibilities the market offers."

    },
    experience: [
        {
            id: 1,
            title: "Software Developer @ Clan Ingegno Digitale",
            company: "Clan Ingegno Digitale",
            period: "May 2022 - Present",
            icon: clan,
            description: "Design and implementation of distributed, secure, and efficient backend systems.",
            subExperiences: [
                {
                    title: "Consultant Software Developer @ Atlas Reply",
                    icon: atlasReply,
                    period: "May 2022 - Dec 2024",
                    description: "Development for a merchant creditworthiness platform within the Nexi payments ecosystem, mainly back-end development with some fixes or development on the front-end side.",
                    technologies: [
                        { name: "Java", icon: java },
                        { name: "Spring", icon: spring },
                        { name: "Maven", icon: maven },
                        { name: "Gradle", icon: gradle },
                        { name: "HTML", icon: html },
                        { name: "CSS", icon: css },
                        { name: "JS", icon: js },
                        { name: "React", icon: react },
                        { name: "Postgre", icon: postgre },
                        { name: "MongoDB", icon: mongo_db },
                        { name: "Git", icon: git },
                        { name: "Kafka", icon: kafka },
                        { name: "Logstash", icon: logstash }
                    ]
                },
            ]
        },
        {
            id: 2,
            title: "Junior Developer @ Almaviva",
            company: "Almaviva",
            period: "Feb 2020 - Apr 2022",
            icon: almaviva,
            description: "Junior developer focused mainly on the backend side on the project for AIFA.",
            subExperiences: [
                {
                    title: "Junior Developer",
                    icon: aifa,
                    period: "Feb 2020 - Apr 2022",
                    description: "Bugfixing of existing application, development of new features for old applications, cordination of deployments between teams.",
                    technologies: [
                        { name: "Java", icon: java },
                        { name: "Spring", icon: spring },
                        { name: "Maven", icon: maven },
                        { name: "HTML", icon: html },
                        { name: "CSS", icon: css },
                        { name: "JS", icon: js },
                        { name: "OracleDB", icon: db },
                        { name: "MongoDB", icon: mongo_db },
                        { name: "Git", icon: git },
                        { name: "AngularJS", icon: angularJS },
                        { name: "Tomcat", icon: tomcat }
                    ]
                },
            ]
        }
    ],
    techStack: [
        { name: "Java SE / EE", icon: java },
        { name: "Spring", icon: spring },
        { name: "Maven", icon: maven },
        { name: "Gradle", icon: gradle },
        { name: "HTML", icon: html },
        { name: "CSS", icon: css },
        { name: "JS", icon: js },
        { name: "React", icon: react },
        { name: "NodeJS", icon: node_js },
        { name: "PostgreSQL", icon: postgre },
        { name: "MongoDB", icon: mongo_db },
        { name: "Kafka", icon: kafka },
        { name: "Docker", icon: docker },
        { name: "Git", icon: git },
    ]
};