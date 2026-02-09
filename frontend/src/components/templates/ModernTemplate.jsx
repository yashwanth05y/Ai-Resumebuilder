import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const ModernTemplate = ({ data, color = 'blue' }) => {
    const { personal, education, experience, skills, projects } = data;

    const colors = {
        blue: 'text-blue-600 border-blue-600',
        purple: 'text-purple-600 border-purple-600',
        emerald: 'text-emerald-600 border-emerald-600',
        pink: 'text-pink-600 border-pink-600',
    };

    const themeClass = colors[color] || colors.blue;
    const bgClass = color === 'blue' ? 'bg-blue-50' : (color === 'purple' ? 'bg-purple-50' : (color === 'emerald' ? 'bg-emerald-50' : 'bg-pink-50'));
    const dotClass = themeClass.split(' ')[0].replace('text-', 'bg-');

    return (
        <div className="w-full h-full min-h-[1056px] bg-white text-slate-800 p-10 shadow-2xl font-sans relative overflow-hidden" id="resume-preview-content">
            {/* Decorative Header Background */}
            <div className={`absolute top-0 left-0 w-full h-2 ${dotClass}`}></div>

            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8 mt-4">
                <div className="flex items-center gap-6">
                    {data.personal.photo && (
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 shadow-md">
                            <img src={data.personal.photo} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div>
                        <h1 className={`text-5xl font-bold uppercase tracking-tight mb-2 ${themeClass.split(' ')[0]}`}>{personal.fullName || 'YOUR NAME'}</h1>
                        <p className="text-xl text-slate-600 font-medium tracking-wide">{personal.role || 'Professional Role'}</p>
                    </div>
                </div>
                <div className="text-right space-y-1.5 text-sm text-slate-500 font-medium">
                    {personal.email && <div className="flex items-center justify-end gap-2 hover:text-slate-800 transition-colors"><Mail size={14} /> {personal.email}</div>}
                    {personal.phone && <div className="flex items-center justify-end gap-2 hover:text-slate-800 transition-colors"><Phone size={14} /> {personal.phone}</div>}
                    {personal.address && <div className="flex items-center justify-end gap-2 hover:text-slate-800 transition-colors"><MapPin size={14} /> {personal.address}</div>}
                    {personal.website && <div className="flex items-center justify-end gap-2 hover:text-slate-800 transition-colors"><Globe size={14} /> {personal.website}</div>}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-10">

                {/* Left Column (Skills, Education) - Narrower */}
                <div className="col-span-4 space-y-10">

                    {/* Skills */}
                    {skills && skills.length > 0 && (
                        <div>
                            <h3 className={`text-xs font-bold uppercase tracking-[0.2em] mb-5 text-slate-400 flex items-center gap-2`}>
                                <span className={`w-8 h-[2px] ${dotClass}`}></span> Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, index) => (
                                    <span key={index} className={`px-3 py-1.5 rounded-md text-xs font-bold ${bgClass} ${themeClass.split(' ')[0]}`}>
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {education && education.length > 0 && (
                        <div>
                            <h3 className={`text-xs font-bold uppercase tracking-[0.2em] mb-5 text-slate-400 flex items-center gap-2`}>
                                <span className={`w-8 h-[2px] ${dotClass}`}></span> Education
                            </h3>
                            <div className="space-y-6">
                                {education.map((edu, index) => (
                                    <div key={index} className="group">
                                        <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{edu.degree}</p>
                                        <p className="text-xs text-slate-600 font-medium mt-0.5">{edu.school}</p>
                                        <p className="text-[10px] text-slate-400 mt-1 italic">{edu.start} - {edu.end}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column (Experience, Projects) - Wider */}
                <div className="col-span-8 space-y-10">

                    {/* Summary */}
                    {personal.summary && (
                        <div className="mb-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <p className="text-slate-600 leading-relaxed text-sm text-justify">{personal.summary}</p>
                        </div>
                    )}

                    {/* Experience */}
                    {experience && experience.length > 0 && (
                        <div>
                            <h3 className={`text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-3 ${themeClass.split(' ')[0]}`}>
                                Experience
                                <span className="flex-1 h-[1px] bg-slate-200"></span>
                            </h3>
                            <div className="space-y-8">
                                {experience.map((exp, index) => (
                                    <div key={index} className="relative pl-6 border-l-2 border-slate-100 hover:border-blue-200 transition-colors">
                                        <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full border-2 border-white ${dotClass}`}></div>
                                        <h4 className="font-bold text-slate-800 text-lg">{exp.role}</h4>
                                        <div className="flex justify-between items-center mb-3 mt-1">
                                            <p className="text-sm font-semibold text-slate-600">{exp.company}</p>
                                            <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded">{exp.start} — {exp.end}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 whitespace-pre-line leading-relaxed">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects */}
                    {projects && projects.length > 0 && (
                        <div className="mt-8">
                            <h3 className={`text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-3 ${themeClass.split(' ')[0]}`}>
                                Key Projects
                                <span className="flex-1 h-[1px] bg-slate-200"></span>
                            </h3>
                            <div className="grid grid-cols-1 gap-5">
                                {projects.map((proj, index) => (
                                    <div key={index} className="group p-5 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{proj.name}</h4>
                                            {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline">View Project</a>}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 mb-3 leading-relaxed">{proj.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {proj.techStack && proj.techStack.split(',').map((t, i) => (
                                                <span key={i} className="text-[10px] bg-slate-50 px-2 py-1 rounded text-slate-500 font-medium border border-slate-100">{t.trim()}</span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Branding (Watermark for free users) */}
            <div className="absolute bottom-4 right-8 text-[10px] text-slate-300 font-medium">
                Generated by AI Resume Builder
            </div>
        </div>
    );
};

export default ModernTemplate;
