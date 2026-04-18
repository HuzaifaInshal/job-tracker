I am planning to create a job application tracker website, the current code is just a nextjs boilerplate, i am planning to have following features:

1. Use firebase mcp to setup and configure Firebase Data Connect postgresql one
2. for authentication use firebase-auth, only one authentication method is allowed and that is sign in with google
3. The app should be multiuser, with each user having its own dashboard.
4. the application itself should be featuring following properties: company name, job title, channel (options indeed, linkedin, sepcify if others ), apply type (direct apply, external website, Email, specify if others), date and time, email/website link (subjected to apply type), who posted this in channel (hr/company), hr/compony name (could be autofilled with company name if company itself posted it), hr/company link, social post link, extra notes, application status (pending (default), accepted, rejected, need immediate attention, expired)
5. each application itself would have a timeline feature, each timeline would have title (should be string, but with some available options on client side already like email received, call received etc), description, date & time received
6. when adding a timeline I can also update the application status alongside addding, also keep a record of it that in this time line status was updated
7. application status can also be updated outside of adding timeline, so if i am updating status directly then create a default timeline application status updated
8. use frontend design skill, the ui should be clean elegant modern look with modals, proper all available filters in job application table, when click on an item in table, open sidebar sheet with relevant information and timeline
9. for Fe tech stack, you are already using Nextjs, use tailwind, axios (if required), radix ui
