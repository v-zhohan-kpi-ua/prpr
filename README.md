# PRPR (Public Registry of Property Restoration)

## About project

**PRPR is** a graduation project for the Information Systems and Technology master's degree at Kyiv Polytechnic Institute, Ukraine. The project was completed part-time (up to 20 hours per week for 2.5 months), with most of the effort dedicated to the astronomical amount of paperwork, as is required by the university. The project was developed by a single member.

**Why**: the project was developed to provide a transparent, efficient, and citizen-engaged system for documenting and managing information about destroyed property and infrastructure, facilitating effective post-war recovery efforts in Ukraine.

**Tech Stack**: TypeScript, Node.js (Nest.js), React (Next.js 13+), Postgres, Turborepo, S3 (AWS).

### What was done

**Functional features**: registration and submission of damage applications, real-time tracking of application and case status, admin features for review and approval of applications, integration with S3 storage for document uploads (automatic generation of signed URLs for secure file transfer) user-friendly interface for public and administrative use, etc.

## Screenshots

### Home (Index) Page

![Home (Index) Page](./.github/readme/images/screens/1.png "Home (Index) Page")

### Application Creation Related Pages

![Application Creation Page: Start](./.github/readme/images/screens/2.png "Application Creation Page: Start")
![Application Creation Page: Form Step One (Personal Info)](./.github/readme/images/screens/3.png "Application Creation Page: Form Step One (Personal Info)")
![Application Creation Page: Form Step Three (Docs)](./.github/readme/images/screens/4.png "Application Creation Page: Form Step Three (Docs)")
![Application Creation Page: Form Submitted](./.github/readme/images/screens/5.png "Application Creation Page: Form Submitted")

### Application Page After Creating

![Application Page After Creating](./.github/readme/images/screens/6.png "Application Page After Creating")

### Admin Pages

![Admin Login](./.github/readme/images/screens/7.png "Admin Login")
![Admin F0 Moderation](./.github/readme/images/screens/8.png "Admin F0 Moderation")
![Admin No Applications to Moderate](./.github/readme/images/screens/9.png "Admin No Applications to Moderate")

### Application Page After Approve

![Application Page After Approve](./.github/readme/images/screens/10.png "Application Page After Approve")

### Case Page

![Case Page](./.github/readme/images/screens/11.png "Case Page")

## Diagrams

### Entity Relationship

![Entity Relationship](./.github/readme/images/diagrams/1.png "Entity Relationship")

### Architecture Diagram

![Architecture Diagram](./.github/readme/images/diagrams/2.png "Architecture Diagram")

### Sequence Diagram of Submitting Application f0

![Sequence Diagram of Submitting Application f0](./.github/readme/images/diagrams/3.png "Sequence Diagram of Submitting Application f0")

### Lifecycle Diagram of Application f0

![Lifecycle Diagram of Application f0](./.github/readme/images/diagrams/4.png "Lifecycle Diagram of Application f0")

### Sequence Diagram of Opening Case c0 as a Result of Application f0

![Sequence Diagram of Opening Case c0 as a Result of Application f0](./.github/readme/images/diagrams/5.png "Sequence Diagram of Opening Case c0 as a Result of Application f0")
