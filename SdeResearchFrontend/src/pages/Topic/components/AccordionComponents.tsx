import DOMPurify from 'dompurify';
import { Accordion, AccordionDetails, AccordionSummary, Typography, IconButton, } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import RemoveIcon from '@mui/icons-material/Remove';
import { TopicSection } from '../../../utils/types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type AccordionSectionProps = {
  section: TopicSection,
  i: number,
  expanded: number | false,
  onOpenAccordion: (panel: number) => void,
  backgroundColor: string,
}

export const AccordionSection = ({ section, i, expanded, onOpenAccordion, backgroundColor }: AccordionSectionProps) => (
  <Accordion expanded={expanded === i} onChange={() => onOpenAccordion(i)} sx={{ backgroundColor }} key={i}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1bh-content"
      id="panel1bh-header"
    >
      <Typography sx={{ width: '33%', flexShrink: 0 }}>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.sectionTitle) }}></div>
      </Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography>
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.sectionBody) }}></div>
      </Typography>
    </AccordionDetails>
  </Accordion>
);

type AccordionItemProps = {
  content: TopicSection[],
  expanded: number | false,
  onOpenAccordion: (panel: number) => void,
  backgroundColor: string,
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ content, expanded, onOpenAccordion, backgroundColor }) => {
  return (
    <>
      {content.map((section: TopicSection, i: number) => (
        <AccordionSection
          key={i}
          i={i}
          section={section}
          expanded={expanded}
          onOpenAccordion={onOpenAccordion}
          backgroundColor={backgroundColor}
        />
      ))}
    </>
  );
};

type AccordionControlsProps = {
  i: number,
  contentToEdit: TopicSection[],
  onRemoveAccordion: (i: number) => void,
  onAddNewAccordion: (i: number,) => void,
  onRepositionAccordion: (i: number, something?: boolean) => void,
}

export const AccordionControls = ({ i, contentToEdit, onRemoveAccordion, onAddNewAccordion, onRepositionAccordion }: AccordionControlsProps) => (
  <>
    {i !== 0 &&
      <IconButton onClick={() => onRemoveAccordion(i)}>
        <RemoveIcon />
      </IconButton>
    }
    <IconButton onClick={() => onAddNewAccordion(i)}>
      <AddIcon />
    </IconButton>
    {contentToEdit.length > 1 &&
      <>
        <IconButton onClick={() => onRepositionAccordion(i)}>
          <ArrowCircleUpIcon />
        </IconButton>
        <IconButton onClick={() => onRepositionAccordion(i, false)}>
          <ArrowCircleDownIcon />
        </IconButton>
      </>
    }
  </>
);
