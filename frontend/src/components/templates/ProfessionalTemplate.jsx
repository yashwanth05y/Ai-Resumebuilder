import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const ProfessionalTemplate = ({ data, color }) => {
    const { personal, education, experience, skills, projects } = data;

    const colors = {
        blue: 'bg-blue-800 text-white',
        teal: 'bg-teal-800 text-white',
        rose: 'bg-rose-800 text-white',
        amber: 'bg-amber-800 text-white',
        slate: 'bg-slate-800 text-white',
    };

    const themeBg = colors[color] || colors.slate;
    const themeText = color ? `text-${color}-800` : 'text-slate-800';

    return (
        <div className="w-full h-full min-h-[1056px] bg-white text-slate-800 font-sans flex flex-col" id="resume-preview-content">
            {/* Heavy Header */}
            <div className={`${themeBg} p-10 text-center`}>
                <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">{personal.fullName || 'YOUR NAME'}</h1>
                <p className="text-lg font-light tracking-wide opacity-90 mb-6">{personal.role || 'Designation'}</p>

                <div className="flex justify-center gap-6 text-xs opacity-80 flex-wrap">
                    {personal.email && <span className="flex items-center gap-1"><Mail size={12} /> {personal.email}</span>}
                    {personal.phone && <span className="flex items-center gap-1"><Phone size={12} /> {personal.phone}</span>}
                    {personal.address && <span className="flex items-center gap-1"><MapPin size={12} /> {personal.address}</span>}
                </div>
            </div>

            <div className="flex flex-1">
                {/* Sidebar */}
                <div className="w-1/3 bg-slate-50 p-8 border-r border-slate-200">
                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <div className="mb-10">
                            <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 border-b-2 border-slate-300 pb-1`}>Skills</h3>
                            <div className="space-y-2">
                                {skills.map((skill, index) => (
                                    <div key={index} className="text-sm font-medium text-slate-700">{skill}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <div className="mb-10">
                            <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 border-b-2 border-slate-300 pb-1`}>Education</h3>
                            <div className="space-y-6">
                                {education.map((edu, index) => (
                                    <div key={index}>
                                        <div className="font-bold text-sm text-slate-800">{edu.degree}</div>
                                        <div className="text-xs text-slate-600 mb-1">{edu.school}</div>
                                        <div className="text-[10px] text-slate-400 italic">{edu.start} - {edu.end}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="w-2/3 p-10">
                    {/* Summary */}
                    {personal.summary && (
                        <div className="mb-10">
                            <h3 className={`text-lg font-bold uppercase tracking-widest mb-4 border-b-2 border-slate-200 pb-2 ${themeText}`}>Profile</h3>
                            <p className="text-sm text-slate-600 leading-relaxed text-justify">{personal.summary}</p>
                        </div>
                    )}

                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <div className="mb-10">
                            <h3 className={`text-lg font-bold uppercase tracking-widest mb-6 border-b-2 border-slate-200 pb-2 ${themeText}`}>Experience</h3>
                            <div className="space-y-8">
                                {experience.map((exp, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-slate-800 text-base">{exp.role}</h4>
                                            <span className="text-xs font-mono text-slate-400">{exp.start} - {exp.end}</span>
                                        </div>
                                        <div className="text-sm font-medium text-slate-600 mb-2">{exp.company}</div>
                                        <p className="text-sm text-slate-500 whitespace-pre-line">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <div>
                            <h3 className={`text-lg font-bold uppercase tracking-widest mb-6 border-b-2 border-slate-200 pb-2 ${themeText}`}>Projecs</h3>
                            <div className="space-y-6">
                                {projects.map((proj, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-slate-800 text-sm">{proj.name}</h4>
                                            {proj.link && <a href={proj.link} className="text-[10px] text-blue-500 hover:underline">Link</a>}
                                        </div>
                                        <p className="text-xs text-slate-500 mb-1">{proj.description}</p>
                                        {proj.techStack && <div className="text-[10px] text-slate-400 italic">Stack: {proj.techStack}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfessionalTemplate;
