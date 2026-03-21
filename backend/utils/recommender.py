"""
SmartGrad AI - Recommendation Engine
Generates personalized career improvement suggestions based on weak features.
"""

from typing import Dict, List


# Thresholds for "weak" features
THRESHOLDS = {
    "cgpa":           7.0,
    "backlogs":       2,      # more than this is bad
    "attendance":     75.0,
    "projects":       3,
    "internships":    1,
    "certifications": 2,
    "speaking_skills":3,
    "ml_knowledge":   3,
    "aptitude_score": 60.0,
}

SKILL_COURSES = {
    "cgpa": [
        {"title": "Study Skills & Academic Excellence", "platform": "Coursera", "url": "https://www.coursera.org/learn/learning-how-to-learn"},
        {"title": "Time Management Fundamentals", "platform": "LinkedIn Learning", "url": "https://www.linkedin.com/learning/"},
    ],
    "backlogs": [
        {"title": "Exam Preparation Strategies", "platform": "YouTube", "url": "https://youtube.com"},
        {"title": "Subject-specific tutoring", "platform": "Khan Academy", "url": "https://www.khanacademy.org"},
    ],
    "attendance": [
        {"title": "Build Consistent Study Habits", "platform": "Coursera", "url": "https://www.coursera.org"},
    ],
    "projects": [
        {"title": "Build 5 Real-World Projects", "platform": "freeCodeCamp", "url": "https://www.freecodecamp.org"},
        {"title": "Full Stack Web Development", "platform": "Udemy", "url": "https://www.udemy.com/course/the-web-developer-bootcamp/"},
        {"title": "Data Science Projects", "platform": "Kaggle", "url": "https://www.kaggle.com/learn"},
    ],
    "internships": [
        {"title": "How to Land Your First Internship", "platform": "LinkedIn", "url": "https://www.linkedin.com/learning/"},
        {"title": "Internship Preparation", "platform": "Internshala", "url": "https://internshala.com"},
    ],
    "certifications": [
        {"title": "AWS Cloud Practitioner", "platform": "AWS", "url": "https://aws.amazon.com/certification/"},
        {"title": "Google Data Analytics", "platform": "Coursera", "url": "https://www.coursera.org/professional-certificates/google-data-analytics"},
        {"title": "Meta Front-End Developer", "platform": "Coursera", "url": "https://www.coursera.org/professional-certificates/meta-front-end-developer"},
    ],
    "speaking_skills": [
        {"title": "Public Speaking Masterclass", "platform": "Udemy", "url": "https://www.udemy.com/course/the-complete-presentation-and-public-speaking-course/"},
        {"title": "Communication Foundations", "platform": "LinkedIn Learning", "url": "https://www.linkedin.com/learning/"},
    ],
    "ml_knowledge": [
        {"title": "Machine Learning Specialization", "platform": "Coursera", "url": "https://www.coursera.org/specializations/machine-learning-introduction"},
        {"title": "Deep Learning with Python", "platform": "Udemy", "url": "https://www.udemy.com/course/complete-deep-learning/"},
        {"title": "Hands-On ML with Scikit-Learn", "platform": "O'Reilly", "url": "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/"},
    ],
    "aptitude_score": [
        {"title": "Quantitative Aptitude for Competitive Exams", "platform": "Unacademy", "url": "https://unacademy.com"},
        {"title": "Logical Reasoning & Problem Solving", "platform": "IndiaBix", "url": "https://www.indiabix.com"},
        {"title": "DSA for Placements", "platform": "LeetCode", "url": "https://leetcode.com"},
    ],
}

IMPROVEMENT_TIPS = {
    "cgpa":           "Focus on improving your CGPA — aim for 7.5+. Attend extra classes and seek faculty guidance.",
    "backlogs":       "Clear your backlogs as soon as possible. Backlogs significantly reduce placement chances.",
    "attendance":     "Maintain at least 75% attendance. Regular attendance correlates with better academic performance.",
    "projects":       "Build at least 3–5 projects. Showcase them on GitHub and your resume.",
    "internships":    "Apply for internships on Internshala, LinkedIn, and AngelList. Even 1 internship makes a big difference.",
    "certifications": "Earn 2–3 industry certifications (AWS, Google, Microsoft) to stand out.",
    "speaking_skills":"Join a Toastmasters club or practice mock interviews to improve communication.",
    "ml_knowledge":   "Strengthen your ML/AI knowledge — it's one of the most in-demand skills in 2025.",
    "aptitude_score": "Practice aptitude daily on IndiaBix or PrepInsta. Most companies test aptitude in their hiring process.",
}


def generate_recommendations(student_data: Dict) -> Dict:
    """
    Analyze student profile and return weak areas, tips, and course suggestions.
    """
    weak_areas: List[str] = []
    tips: List[str] = []
    courses: List[Dict] = []

    for feature, threshold in THRESHOLDS.items():
        value = student_data.get(feature)
        if value is None:
            continue

        is_weak = False
        if feature == "backlogs":
            is_weak = value > threshold
        else:
            is_weak = value < threshold

        if is_weak:
            weak_areas.append(feature.replace("_", " ").title())
            tips.append(IMPROVEMENT_TIPS[feature])
            courses.extend(SKILL_COURSES.get(feature, []))

    # Deduplicate courses by title
    seen = set()
    unique_courses = []
    for c in courses:
        if c["title"] not in seen:
            seen.add(c["title"])
            unique_courses.append(c)

    # Overall risk level
    risk_score = len(weak_areas) / len(THRESHOLDS) * 100
    if risk_score < 25:
        risk_level = "Low"
    elif risk_score < 55:
        risk_level = "Medium"
    else:
        risk_level = "High"

    return {
        "weak_areas": weak_areas,
        "tips": tips,
        "courses": unique_courses[:8],   # cap at 8 suggestions
        "risk_score": round(risk_score, 1),
        "risk_level": risk_level,
    }
