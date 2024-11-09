CREATE TABLE Event_Edition (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    call_for_papers_text TEXT NOT NULL,
    partners_text TEXT NOT NULL,
    url VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    event_start_date TIMESTAMP NOT NULL,
    event_end_date TIMESTAMP NOT NULL,
    submission_deadline TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_evaluation_restrict_to_logged_users BOOLEAN DEFAULT TRUE NOT NULL,
    presentation_duration INTEGER DEFAULT 20 NOT NULL,
    presentations_per_presentation_block INT DEFAULT 6 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE user_account_profile AS ENUM ('DoctoralStudent', 'Professor', 'Listener');
CREATE TYPE user_account_level AS ENUM ('Superadmin', 'Admin', 'Default');

CREATE TABLE User_Account (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    registration_number VARCHAR(20),
    profile user_account_profile NOT NULL DEFAULT 'DoctoralStudent',
    level user_account_level NOT NULL DEFAULT 'Default',
    photo_file_path VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE submission_status AS ENUM ('Submitted', 'Confirmed', 'Rejected');

CREATE TABLE Submission (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    advisor_id uuid REFERENCES User_Account(id) NOT NULL,
    main_author_id uuid REFERENCES User_Account(id) NOT NULL,
    event_edition_id uuid REFERENCES Event_Edition(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    abstract TEXT NOT NULL,
    pdf_file VARCHAR(255) NOT NULL,
    ranking INTEGER,
    status submission_status DEFAULT 'Submitted' NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    linkedin_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Evaluation_Criteria (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_edition_id uuid NOT NULL REFERENCES Event_Edition(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    weight_ratio DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Evaluation (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES User_Account(id) NOT NULL,
    evaluation_criteria_id uuid REFERENCES Evaluation_Criteria(id) NOT NULL,
    submission_id uuid REFERENCES Submission(id) NOT NULL,
    score DOUBLE PRECISION NOT NULL,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Co_Author (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id uuid REFERENCES Submission(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Certificate (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_edition_id uuid REFERENCES Event_Edition(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Room (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_edition_id uuid REFERENCES Event_Edition(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE presentation_block_type AS ENUM ('General', 'Presentation');

CREATE TABLE Presentation_Block (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_edition_id uuid REFERENCES Event_Edition(id) NOT NULL,
    room_id uuid REFERENCES Room(id),
    type presentation_block_type NOT NULL,
    title VARCHAR(255),
    speaker_name VARCHAR(255),
    start_time TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE panelist_status AS ENUM ('Pending', 'Confirmed', 'Rejected', 'Present', 'Missing');

CREATE TABLE Panelist (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    presentation_block_id uuid REFERENCES Presentation_Block(id) NOT NULL,
    user_id uuid REFERENCES User_Account(id) NOT NULL,
    status panelist_status DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE presentation_status AS ENUM ('ToPresent', 'Presented', 'NotPresented');

CREATE TABLE Presentation (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id uuid REFERENCES Submission(id) NOT NULL,
    presentation_block_id uuid REFERENCES Presentation_Block(id) NOT NULL,
    position_within_block INT NOT NULL,
    status presentation_status DEFAULT 'ToPresent' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Awarded_Panelist (
    event_edition_id uuid REFERENCES Event_Edition(id) NOT NULL,
    user_id uuid REFERENCES User_Account(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_edition_id, user_id)
);

CREATE TYPE committee_level AS ENUM ('Committee', 'Coordinator');
CREATE TYPE committee_role AS ENUM ('OrganizingCommittee', 'StudentVolunteers', 'AdministrativeSupport', 'Communication', 'ITSupport');

CREATE TABLE Committee_Member (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_edition_id uuid REFERENCES Event_Edition(id) NOT NULL,
    user_id uuid REFERENCES User_Account(id) NOT NULL,
    level committee_level NOT NULL,
    role committee_role NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
