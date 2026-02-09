import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Briefcase, GraduationCap, Code, LayoutTemplate, Download, CreditCard, ChevronLeft, ChevronRight, Eye, Wand2, Star, Trash2, Plus, Check } from 'lucide-react';
import ResumePreview from './ResumePreview';
import { templates } from '../data/templates';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { toast } from 'react-hot-toast';

// --- Form Components ---
const FormInput = ({ label, name, value, onChange, placeholder, type = "text" }) => (
    <div className="group">
        <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 group-focus-within:text-pink-400 transition-colors">{label}</label>
        <div className="relative">
            <input
                type={type}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-slate-800/50 text-white border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-slate-600"
            />
            <div className="absolute inset-0 rounded-lg border border-white/5 pointer-events-none group-hover:border-white/10 transition-colors"></div>
        </div>
    </div>
);

const FormTextarea = ({ label, name, value, onChange, placeholder }) => (
    <div className="group">
        <label className="block text-xs font-medium text-slate-400 mb-1 ml-1 group-focus-within:text-pink-400 transition-colors">{label}</label>
        <textarea
            name={name}
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
            rows={4}
            className="w-full bg-slate-800/50 text-white border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder:text-slate-600 resize-none"
        />
    </div>
);

const ResumeBuilder = ({ onUpgrade, onBack, initialStep = 0 }) => {
    const [activeStep, setActiveStep] = useState(initialStep);
    const [isGenerating, setIsGenerating] = useState(false);
    const [resumeData, setResumeData] = useState({
        personal: { fullName: '', email: '', phone: '', address: '', website: '', summary: '', role: '' },
        education: [],
        experience: [],
        skills: [],
        projects: []
    });

    const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

    const steps = [
        { id: 'personal', label: 'Personal', icon: User },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'skills', label: 'Skills', icon: Code },
        { id: 'projects', label: 'Projects', icon: LayoutTemplate },
        { id: 'templates', label: 'Templates', icon: Check },
    ];

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setResumeData(prev => ({ ...prev, personal: { ...prev.personal, [name]: value } }));
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setResumeData(prev => ({ ...prev, personal: { ...prev.personal, photo: reader.result } }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addItem = (section, item) => {
        setResumeData(prev => ({ ...prev, [section]: [...prev[section], item] }));
    };

    const updateItem = (section, index, field, value) => {
        const newItems = [...resumeData[section]];
        newItems[index] = { ...newItems[index], [field]: value };
        setResumeData(prev => ({ ...prev, [section]: newItems }));
    };

    const removeItem = (section, index) => {
        const newItems = [...resumeData[section]];
        newItems.splice(index, 1);
        setResumeData(prev => ({ ...prev, [section]: newItems }));
    };

    const handleSkillChange = (e) => {
        const skills = e.target.value.split(',').map(s => s.trim());
        setResumeData(prev => ({ ...prev, skills }));
    };

    const [showAuthModal, setShowAuthModal] = useState(false);
    const { user, updateDownloadCount } = useAuth();

    const handleDownloadClick = async () => {
        if (!user) {
            setShowAuthModal(true);
        } else {
            // Check limit client-side for immediate feedback
            if (!user.isPremium && user.downloadCount >= 1) {
                toast.error("You've used your free download!");
                onUpgrade(); // Open Payment Modal
                return;
            }

            // Try to increment (server checks limit too)
            const allowed = await updateDownloadCount();
            if (allowed) {
                await generatePDF();
            } else {
                onUpgrade(); // Open Payment Modal if server denied
            }
        }
    };

    const generatePDF = async () => {
        setIsGenerating(true);
        const element = document.getElementById('resume-preview-content'); // Target the content div directly
        if (!element) return;

        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${resumeData.personal.fullName || 'resume'}.pdf`);
        } catch (err) {
            console.error("PDF Generation Error", err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col lg:flex-row text-white overflow-hidden">
            {/* Sidebar Sidebar */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full lg:w-16 bg-slate-950 border-r border-slate-800 flex flex-row lg:flex-col items-center py-4 lg:py-8 justify-between z-20"
            >
                <div className="mb-0 lg:mb-8 font-bold text-pink-500 text-xl tracking-tighter px-4 cursor-pointer" onClick={onBack}>
                    RB
                </div>
                <div className="flex flex-row lg:flex-col gap-4 px-4 overflow-x-auto lg:overflow-visible no-scrollbar">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isActive = activeStep === idx;
                        return (
                            <button
                                key={step.id}
                                onClick={() => setActiveStep(idx)}
                                className={`p-3 rounded-xl transition-all relative group ${isActive ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/25' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                                title={step.label}
                            >
                                <Icon size={20} />
                                {isActive && <motion.div layoutId="active-pill" className="absolute inset-0 border-2 border-pink-400 rounded-xl opacity-50" />}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-auto px-4">
                    <button onClick={onBack} className="p-3 text-slate-500 hover:text-white transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                </div>
            </motion.div>

            {/* Main Content Area: Form */}
            <div className="flex-1 flex flex-col h-full lg:h-screen overflow-hidden">

                {/* Top Bar */}
                <div className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur flex items-center justify-between px-6 z-10">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        {steps[activeStep].label}
                    </h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onUpgrade}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg text-xs font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-yellow-500/20 transition-all"
                        >
                            <Star size={14} className="fill-white" /> Go Premium
                        </button>
                        <button
                            onClick={handleDownloadClick}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-all"
                        >
                            {isGenerating ? 'Generating...' : <><Download size={14} /> Download</>}
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                    {/* Scrollable Form */}
                    <div className="flex-1 overflow-y-auto p-6 lg:p-10 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-2xl mx-auto space-y-8 pb-20"
                            >

                                {/* Personal Step */}
                                {activeStep === 0 && (
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                            <User className="text-pink-500" /> Tell us about yourself
                                        </h3>
                                        {/* Photo Upload */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden relative group">
                                                {resumeData.personal.photo ? (
                                                    <img src={resumeData.personal.photo} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="text-slate-500 group-hover:text-pink-400 transition-colors" />
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoUpload}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">Upload Photo</p>
                                                <p className="text-xs text-slate-400">JPG, PNG (Max 2MB)</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormInput label="Full Name" name="fullName" value={resumeData.personal.fullName} onChange={handlePersonalChange} placeholder="e.g. John Doe" />
                                            <FormInput label="Job Title" name="role" value={resumeData.personal.role} onChange={handlePersonalChange} placeholder="e.g. Senior Frontend Developer" />
                                            <FormInput label="Email" name="email" value={resumeData.personal.email} onChange={handlePersonalChange} placeholder="e.g. john@example.com" type="email" />
                                            <FormInput label="Phone" name="phone" value={resumeData.personal.phone} onChange={handlePersonalChange} placeholder="e.g. +1 234 567 890" />
                                            <FormInput label="Location" name="address" value={resumeData.personal.address} onChange={handlePersonalChange} placeholder="e.g. San Francisco, CA" />
                                            <FormInput label="Website / LinkedIn" name="website" value={resumeData.personal.website} onChange={handlePersonalChange} placeholder="e.g. linkedin.com/in/johndoe" />
                                        </div>
                                        <FormTextarea label="Professional Summary" name="summary" value={resumeData.personal.summary} onChange={handlePersonalChange} placeholder="Briefly describe your professional background..." />
                                    </div>
                                )}

                                {/* Education Step */}
                                {activeStep === 1 && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-2xl font-bold text-white flex items-center gap-2"><GraduationCap className="text-pink-500" /> Education</h3>
                                            <button onClick={() => addItem('education', { school: '', degree: '', start: '', end: '' })} className="text-xs bg-pink-500/10 text-pink-500 px-3 py-1 rounded hover:bg-pink-500/20 transition-colors flex items-center gap-1"><Plus size={14} /> Add</button>
                                        </div>
                                        {resumeData.education.map((edu, index) => (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={index} className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 space-y-4 relative group">
                                                <button onClick={() => removeItem('education', index)} className="absolute top-4 right-4 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormInput label="School / University" value={edu.school} onChange={(e) => updateItem('education', index, 'school', e.target.value)} placeholder="Stanford University" />
                                                    <FormInput label="Degree / Major" value={edu.degree} onChange={(e) => updateItem('education', index, 'degree', e.target.value)} placeholder="B.S. Computer Science" />
                                                    <FormInput label="Start Date" value={edu.start} onChange={(e) => updateItem('education', index, 'start', e.target.value)} placeholder="Sep 2018" />
                                                    <FormInput label="End Date" value={edu.end} onChange={(e) => updateItem('education', index, 'end', e.target.value)} placeholder="Jun 2022" />
                                                </div>
                                            </motion.div>
                                        ))}
                                        {resumeData.education.length === 0 && <div className="text-center text-slate-500 py-10 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">No education added yet.</div>}
                                    </div>
                                )}

                                {/* Experience Step */}
                                {activeStep === 2 && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-2xl font-bold text-white flex items-center gap-2"><Briefcase className="text-pink-500" /> Experience</h3>
                                            <button onClick={() => addItem('experience', { company: '', role: '', start: '', end: '', description: '' })} className="text-xs bg-pink-500/10 text-pink-500 px-3 py-1 rounded hover:bg-pink-500/20 transition-colors flex items-center gap-1"><Plus size={14} /> Add</button>
                                        </div>
                                        {resumeData.experience.map((exp, index) => (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={index} className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 space-y-4 relative group">
                                                <button onClick={() => removeItem('experience', index)} className="absolute top-4 right-4 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormInput label="Company Name" value={exp.company} onChange={(e) => updateItem('experience', index, 'company', e.target.value)} placeholder="Google" />
                                                    <FormInput label="Job Title" value={exp.role} onChange={(e) => updateItem('experience', index, 'role', e.target.value)} placeholder="Software Engineer" />
                                                    <FormInput label="Start Date" value={exp.start} onChange={(e) => updateItem('experience', index, 'start', e.target.value)} placeholder="Jan 2023" />
                                                    <FormInput label="End Date" value={exp.end} onChange={(e) => updateItem('experience', index, 'end', e.target.value)} placeholder="Present" />
                                                </div>
                                                <FormTextarea label="Description" value={exp.description} onChange={(e) => updateItem('experience', index, 'description', e.target.value)} placeholder="Describe your responsibilities and achievements..." />
                                            </motion.div>
                                        ))}
                                        {resumeData.experience.length === 0 && <div className="text-center text-slate-500 py-10 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">No experience added yet.</div>}
                                    </div>
                                )}

                                {/* Skills Step */}
                                {activeStep === 3 && (
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                            <Code className="text-pink-500" /> Skills
                                        </h3>
                                        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                            <div className="mb-4 text-sm text-slate-400">Enter your skills separated by commas</div>
                                            <textarea
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-white focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all h-32"
                                                placeholder="React, Node.js, Python, TypeScript..."
                                                value={resumeData.skills.join(', ')}
                                                onChange={handleSkillChange}
                                            />
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {resumeData.skills.map((skill, i) => skill && (
                                                    <span key={i} className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm border border-pink-500/30">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Projects Step */}
                                {activeStep === 4 && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-2xl font-bold text-white flex items-center gap-2"><LayoutTemplate className="text-pink-500" /> Projects</h3>
                                            <button onClick={() => addItem('projects', { name: '', description: '', techStack: '', link: '' })} className="text-xs bg-pink-500/10 text-pink-500 px-3 py-1 rounded hover:bg-pink-500/20 transition-colors flex items-center gap-1"><Plus size={14} /> Add</button>
                                        </div>
                                        {resumeData.projects.map((proj, index) => (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={index} className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 space-y-4 relative group">
                                                <button onClick={() => removeItem('projects', index)} className="absolute top-4 right-4 text-slate-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <FormInput label="Project Name" value={proj.name} onChange={(e) => updateItem('projects', index, 'name', e.target.value)} placeholder="AI Resume Builder" />
                                                    <FormInput label="Project Link" value={proj.link} onChange={(e) => updateItem('projects', index, 'link', e.target.value)} placeholder="https://github.com/..." />
                                                    <FormInput label="Tech Stack" value={proj.techStack} onChange={(e) => updateItem('projects', index, 'techStack', e.target.value)} placeholder="React, Node.js, MongoDB" />
                                                </div>
                                                <FormTextarea label="Description" value={proj.description} onChange={(e) => updateItem('projects', index, 'description', e.target.value)} placeholder="Briefly describe what you built..." />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}



                                {/* Template Selection Step */}
                                {activeStep === 5 && (
                                    <div className="space-y-6">
                                        <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                            <LayoutTemplate className="text-pink-500" /> Select a Template
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                            {templates.map((template) => (
                                                <motion.div
                                                    key={template.id}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setSelectedTemplate(template)}
                                                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all relative group h-48 flex flex-col ${selectedTemplate.id === template.id ? 'border-pink-500 shadow-lg shadow-pink-500/50 ring-2 ring-pink-500/20' : 'border-slate-700 hover:border-slate-500'}`}
                                                >
                                                    {/* Mini Resume Preview */}
                                                    <div className={`flex-1 relative overflow-hidden ${template.color === 'slate' ? 'bg-slate-200' : 'bg-white'}`}>

                                                        {/* Modern Layout Preview */}
                                                        {template.base === 'Modern' && (
                                                            <div className="flex h-full">
                                                                <div className={`w-1/3 h-full bg-${template.color}-100 flex flex-col items-center pt-2 gap-1`}>
                                                                    <div className={`w-6 h-6 rounded-full bg-${template.color}-500 opacity-80`}></div>
                                                                    <div className="w-8 h-1 bg-slate-300 rounded-full"></div>
                                                                    <div className="w-6 h-0.5 bg-slate-300 rounded-full"></div>
                                                                </div>
                                                                <div className="flex-1 p-2 space-y-1">
                                                                    <div className="w-16 h-2 bg-slate-800 rounded-full opacity-20"></div>
                                                                    <div className="w-full h-1 bg-slate-300 rounded-full"></div>
                                                                    <div className="w-10/12 h-1 bg-slate-300 rounded-full"></div>
                                                                    <div className="w-full h-1 bg-slate-300 rounded-full mt-2"></div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Professional Layout Preview */}
                                                        {template.base === 'Professional' && (
                                                            <div className="flex h-full flex-row-reverse">
                                                                <div className={`w-1/4 h-full bg-slate-800 flex flex-col items-center pt-2 gap-1`}>
                                                                    <div className="w-full h-20 bg-white/5"></div>
                                                                </div>
                                                                <div className="flex-1 p-2 space-y-1">
                                                                    <div className={`w-full h-8 bg-${template.color}-100 mb-2`}></div>
                                                                    <div className="w-full h-1 bg-slate-300 rounded-full"></div>
                                                                    <div className="w-10/12 h-1 bg-slate-300 rounded-full"></div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* ATS Layout Preview */}
                                                        {template.base === 'ATS' && (
                                                            <div className="flex flex-col h-full p-3 bg-white space-y-2">
                                                                <div className="w-full h-px bg-black mb-1"></div>
                                                                <div className="w-1/2 h-2 bg-black rounded-sm"></div>
                                                                <div className="w-full h-1 bg-gray-300"></div>
                                                                <div className="w-full h-1 bg-gray-300"></div>
                                                            </div>
                                                        )}

                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                                                            <span className="text-xs font-bold text-white px-2 py-1 bg-black/50 rounded-full backdrop-blur-sm">Use Template</span>
                                                        </div>
                                                    </div>

                                                    <div className="p-3 bg-slate-900 border-t border-slate-800">
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-xs font-bold text-white truncate">{template.name}</p>
                                                            {template.hasPhoto && <div className="text-[10px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-400">Photo</div>}
                                                        </div>
                                                        <p className="text-[10px] text-slate-500 mt-0.5">{template.category}</p>
                                                    </div>

                                                    {selectedTemplate.id === template.id && (
                                                        <div className="absolute top-2 right-2 bg-pink-500 text-white p-1 rounded-full shadow-lg z-10">
                                                            <Check size={14} />
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex justify-between pt-8 border-t border-slate-800 mt-8">
                                    <button
                                        onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                                        disabled={activeStep === 0}
                                        className="px-6 py-3 rounded-lg text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                                    >
                                        <ChevronLeft size={18} /> Previous
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (activeStep === steps.length - 1) {
                                                handleDownloadClick();
                                            } else {
                                                setActiveStep(prev => Math.min(steps.length - 1, prev + 1));
                                            }
                                        }}
                                        className={`px-8 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold flex items-center gap-2 shadow-lg ${activeStep === steps.length - 1 ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-pink-500/20 hover:shadow-pink-500/40' : 'bg-white text-slate-900 hover:bg-slate-200 shadow-white/10'}`}
                                    >
                                        {activeStep === steps.length - 1 ? 'Finish & Download' : 'Next Step'} <ChevronRight size={18} />
                                    </button>
                                </div>

                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Preview Pannel */}
                    <div className="hidden lg:flex w-[45%] bg-slate-950 items-center justify-center p-8 relative overflow-hidden border-l border-slate-800">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 z-0"></div>

                        {/* Live Preview Label */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-slate-900/80 rounded-full px-4 py-1 border border-white/10 text-xs text-slate-400">
                            <Eye size={12} className="text-green-500 animate-pulse" /> Live Preview
                        </div>

                        <div className="z-10 w-full h-full flex items-center justify-center scale-[0.65] origin-center -mt-10">
                            <ResumePreview data={resumeData} template={selectedTemplate} scale={1} />
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showAuthModal && (
                    <AuthModal
                        onClose={() => setShowAuthModal(false)}
                        onSuccess={() => {
                            setShowAuthModal(false);
                            generatePDF();
                        }}
                    />
                )}
            </AnimatePresence>
        </div >
    );
};

export default ResumeBuilder;
