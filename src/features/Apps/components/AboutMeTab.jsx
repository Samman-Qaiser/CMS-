// AboutMeTab.jsx

const SKILLS = ['Admin', 'Dashboard', 'Photoshop', 'Bootstrap', 'Responsive', 'Crypto']
const LANGUAGES = ['English', 'French', 'Bangla']

const INFO_ROWS = [
  { label: 'Name',              value: 'Mitchell C. Shay'               },
  { label: 'Email',             value: 'example@example.com'            },
  { label: 'Availability',      value: 'Full Time (Free Lancer)'        },
  { label: 'Age',               value: '27'                             },
  { label: 'Location',          value: 'Rosemont Avenue Melbourne, Florida' },
  { label: 'Year Experience',   value: '07 Year Experiences'            },
]

function SectionTitle({ children }) {
  return <h3 className="text-sm font-bold text-header-text mb-3">{children}</h3>
}

export default function AboutMeTab() {
  return (
    <div className="bg-[#ffffff] dark:bg-[#292D4A] rounded-md p-6 flex flex-col gap-6">

      {/* About */}
      <div>
        <SectionTitle>About Me</SectionTitle>
        <p className=" text-content-text leading-relaxed mb-3">
          A wonderful serenity has taken possession of my entire soul, like these sweet mornings
          of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence
          was created for the bliss of souls like mine. I am so happy, my dear friend, so absorbed
          in the exquisite sense of mere tranquil existence, that I neglect my talents.
        </p>
        <p className=" text-content-text leading-relaxed">
          A collection of textile samples lay spread out on the table – Samsa was a travelling
          salesman – and above it there hung a picture that he had recently cut out of an
          illustrated magazine and housed in a nice, gilded frame.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-white/10" />

      {/* Skills */}
      <div>
        <SectionTitle>Skills</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className=" font-medium text-header-text bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-md border border-gray-200 dark:border-white/10 hover:border-primary hover:text-primary transition-colors duration-200 cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-white/10" />

      {/* Language */}
      <div>
        <SectionTitle>Language</SectionTitle>
        <div className="flex items-center gap-5 flex-wrap">
          {LANGUAGES.map((lang) => (
            <span key={lang} className=" text-content-text">{lang}</span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-white/10" />

      {/* Personal Info */}
      <div>
        <SectionTitle>Personal Information</SectionTitle>
        <div className="flex flex-col gap-2.5">
          {INFO_ROWS.map((row) => (
            <div key={row.label} className="flex items-start gap-2">
              <span className=" text-content-text w-32 shrink-0">{row.label} :</span>
              <span className=" text-header-text">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
