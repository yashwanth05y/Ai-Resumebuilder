import React from 'react';

const ATSTemplate = ({ data, color }) => {
    const { personal, education, experience, skills, projects } = data;

    return (
        <div className="w-full h-full min-h-[1056px] bg-white text-black p-12 font-serif leading-relaxed" id="resume-preview-content">
            {/* Header */}
            <div className="border-b-2 border-black pb-4 mb-6 text-center">
                <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">{personal.fullName || 'YOUR NAME'}</h1>
                <p className="text-lg font-medium mb-2">{personal.role || 'Professional Role'}</p>
                <div className="text-sm flex flex-wrap justify-center gap-4">
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>| {personal.phone}</span>}
                    {personal.address && <span>| {personal.address}</span>}
                    {personal.website && <span>| {personal.website}</span>}
                </div>
            </div>

            {/* Summary */}
            {personal.summary && (
                <div className="mb-6">
                    <h2 className="text-base font-bold uppercase border-b border-gray-300 mb-2">Professional Summary</h2>
                    <p className="text-sm text-justify">{personal.summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-base font-bold uppercase border-b border-gray-300 mb-4">Work Experience</h2>
                    <div className="space-y-4">
                        {experience.map((exp, index) => (
                            <div key={index}>
                                <div className="flex justify-between font-bold text-sm">
                                    <span>{exp.role}</span>
                                    <span>{exp.start} – {exp.end}</span>
                                </div>
                                <div className="text-sm font-semibold italic mb-1">{exp.company}</div>
                                <p className="text-sm whitespace-pre-line">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-base font-bold uppercase border-b border-gray-300 mb-4">Education</h2>
                    <div className="space-y-3">
                        {education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-sm">{edu.school}</div>
                                    <div className="text-sm italic">{edu.degree}</div>
                                </div>
                                <div className="text-sm text-right font-medium">{edu.start} – {edu.end}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills && skills.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-base font-bold uppercase border-b border-gray-300 mb-3">Skills</h2>
                    <p className="text-sm">{skills.join(', ')}</p>
                </div>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
                <div>
                    <h2 className="text-base font-bold uppercase border-b border-gray-300 mb-4">Projects</h2>
                    <div className="space-y-3">
                        {projects.map((proj, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-sm">{proj.name}</h3>
                                    {proj.link && <a href={proj.link} className="text-xs text-blue-800 underline">Link</a>}
                                </div>
                                <p className="text-sm">{proj.description}</p>
                                {proj.techStack && <p className="text-xs italic mt-0.5">Tech: {proj.techStack}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default ATSTemplate;
