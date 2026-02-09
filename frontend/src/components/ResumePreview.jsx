import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModernTemplate from './templates/ModernTemplate';
import ATSTemplate from './templates/ATSTemplate';
import ProfessionalTemplate from './templates/ProfessionalTemplate';

const ResumePreview = ({ data, template, scale = 1 }) => {
    return (
        <div className="flex justify-center w-full h-full overflow-hidden bg-slate-900/50 backdrop-blur-md p-8 rounded-2xl border border-white/5">
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: scale }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded shadow-2xl origin-top"
                style={{
                    width: '210mm',
                    minHeight: '297mm',
                    height: '297mm', // A4
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center'
                }}
            >
                <div id="resume-preview-content" className="w-full h-full"> {/* Ensure ID matches PDF generator */}
                    {/* Dynamic Template Selection */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            {template.base === 'Modern' && (
                                <ModernTemplate data={data} color={template.color} />
                            )}
                            {template.base === 'Professional' && (
                                <ProfessionalTemplate data={data} color={template.color} />
                            )}
                            {template.base === 'ATS' && (
                                <ATSTemplate data={data} color={template.color} />
                            )}
                            {template.base === 'Minimalist' && (
                                <ProfessionalTemplate data={data} color="slate" /> // Reuse pro but forced to slate
                            )}
                            {template.base === 'Creative' && (
                                <ModernTemplate data={data} color={template.color} /> // Reuse modern with creative colors
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default ResumePreview;
