(function (module) {
    /**
     * @ngdoc   directive
     * @name    Common.Directives:ngSubmit
     * @restrict A
     * @function
     *
     * @description
     * Add this attribute to every .form-group element that you want validation on. It will add the .has-error class whenever the given form
     * has been submitted or the field has been $touched and is $invalid
     *
     * @param {object} lrFormGroup The form object that this field lives in.
     * @param {string} fieldName Name of the form element (this is how we access the field in the form object)
     *
     */
    module.directive('ngSubmit', function() {
        return {
            restrict: 'A',
            require: '^form',
            priority: '10',
            link: {
                pre: function (scope, element, attributes, formController) {
                    if (attributes["novalidate"] === undefined) {
                        attributes.$set('novalidate', 'novalidate');
                    }

                    // Set getDirtyFields function
                    formController.getDirtyFields = function () {

                        var fields = {},
                            formData = {},
                            count=0;

                        angular.forEach(formController, function (field, name) {
                            if (name[0] != '$' && typeof field.$setViewValue == 'function' && field.$dirty) {
                                // This is a dirty form field
                                fields[name] = field.$viewValue;
                                count++;
                            }
                        });

                        if (count > 0) {
                            // Build object for submittal from fields
                            angular.forEach(fields, function (value, key) {
                                json_recursive_create(formData, key, value);
                            });
                        }

                        return formData;

                    };

                    //attributes.$set('ngSubmit', attributes.name + '.$valid && ' + attributes['ngSubmit']);

                    element.on("submit", function(event) {
                        scope.$apply(function () {
                            formController.$setSubmitted();
                        });

                        if (formController && !formController.$valid) {
                            event.stopImmediatePropagation();
                            event.preventDefault();

                            // scroll to the topmost invalid field
                            // var scrollTo = jQuery(element.find('input.ng-invalid')[0]);
                            // var scrollToContainer = scrollTo.closest('.form-group');
                            // var container = scrollTo.closest('.scrollable');
                            //
                            // if (scrollToContainer && scrollToContainer[0]) {
                            //     scrollTo = scrollToContainer;
                            // }
                            //
                            // container.scrollTop(
                            //     scrollTo.offset().top - container.offset().top + container.scrollTop()
                            // );
                        }
                    });
                }
            }
        };
    });
}(angular.module('Common.Directives.ngSubmit', [])));
