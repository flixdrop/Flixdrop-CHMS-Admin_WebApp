export interface Animal {

  general_info: {
    source_of_entry: string,
    date_of_entry: string,
    cattle_name: string,
    cattle_tag_no: string,
    cattle_breed: string,
    cattle_gender: string,
    date_of_birth: string,
    years_of_owning: string,
  },

  family_info: {
    mother_type: string,
    father_type: string,
    birth_type: string
  },

  health_info: {
    skin_color: string,
    average_milk: string,
    vaccine_1: string,
    vaccine_2: string,
    vaccine_3: string,
    date_of_last_insemination: string
  }

}
