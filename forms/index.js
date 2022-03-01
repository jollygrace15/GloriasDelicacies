// import in caolan forms
const forms = require("forms");
// create some shortcuts
const fields = forms.fields;
const validators = forms.validators; 
const widgets = forms.widgets

const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};


//allows Caolan forms to work with bootstrap
//const bootstrapField = function (name, object) {

//};

const createProductForm = function(categories, tags){
    //console.log(tags)
    return forms.create({
        "name":fields.string({
            'required':true,
            'errorAfterField': true,
            'cssClasses': {
                label: ['form-label']
            }
        }),
        "cost": fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators':[validators.integer(), validators.min(1)]
        }),
        "description": fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                label: ['form-label']
            }
        }),
        "category_id": fields.string({
            'label':'Category',
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                label: ['form-label']
            },
            'widget': widgets.select(),
            'choices': categories
        }),
        "tags": fields.string({
            'required': true,
            'errorAfterField': true,
            'cssClasses': {
                label: ['form-label']
            },
            'widget': widgets.multipleSelect(),
            'choices':tags
        }),
        "image_url":fields.string({
            widget: widgets.hidden()
        })
    })
}

const createUserForm = function() {
    return forms.create({
        'username': fields.string({
            required: true,
            errorAfterField: true
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true
        }),
        'password': fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.password()
        }),
        'confirm_password': fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.password(),
            validators:[ validators.matchField('password')]  // the content of the password field
                                                             // must match the cotent of the confirm_password field
        })
    })
}

const createLoginForm = function() {
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField: true
        }),
        'password': fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.password()
        })
    })
}

const createSearchForm = (categories, tags) => {
    return forms.create({
        'name': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'min_cost': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]
        }),
          'max_cost': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]
        }),
        'category_id': fields.string({
            label: 'Category',
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.select(),
            choices: categories
        }),
        'tags': fields.string({
            required:false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices: tags
        }),
    })
}

module.exports = {bootstrapField, createProductForm, createUserForm, createLoginForm, createSearchForm};