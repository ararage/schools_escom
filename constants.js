module.exports = {
    'populateQueryCampusInstitution':{path:'institution',select:'name description'},
    'populateQueryCampusSchools':{path:'schools',select:'name description'},
    'populateQuerySchoolCampus':{path:'campus',select:'name description'},
    'populateQuerySchool':'campus.institution',
}