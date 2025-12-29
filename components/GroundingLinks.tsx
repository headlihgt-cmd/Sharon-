
import React from 'react';
import { ExternalLink, Search, MapPin } from 'lucide-react';
import { GroundingLink } from '../types';

interface GroundingLinksProps {
  links: GroundingLink[];
}

const GroundingLinks: React.FC<GroundingLinksProps> = ({ links }) => {
  return (
    <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-50 flex items-center">
        <Search size={10} className="mr-1" /> Sources vérifiées par Sharon
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((link, idx) => {
          const isMap = link.uri.includes('google.com/maps') || link.uri.includes('place');
          return (
            <a
              key={idx}
              href={link.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 glass px-3 py-1.5 rounded-lg text-xs hover:bg-white/10 transition-colors border border-white/5"
            >
              {isMap ? <MapPin size={12} className="text-red-400" /> : <ExternalLink size={12} className="text-blue-400" />}
              <span className="truncate max-w-[150px]">{link.title}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default GroundingLinks;
