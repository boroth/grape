(function (module) {
    /**
     * @ngdoc   directive
     * @name    LR.UI.directive:grapeFormField
     * @restrict A
     * @function
     *
     * @description
     * Add this attribute to every .form-group element that you want validation on. It will add the .has-error class whenever the given form
     * has been submitted or the field has been $touched and is $invalid
     *
     * @param {string} fieldName Name of the form element (this is how we access the field in the form object)
     *
     */
    module.directive('grapeFormField', function($compile, $log) {
        return {
            require: '^form',
            restrict: 'A',
            replace: false,
            terminal: true,
            priority: 1500,
            link: function(scope, element, attrs, formController) {
                var formName = formController.$name.replace( /-([a-z])/gi, function ( $0, $1 ) { return $1.toUpperCase(); } );
                var fieldName = attrs.grapeFormField;

                if (!fieldName) {
                    $log.error('Directive lr-form-field is missing parameters. You must have the name of the field as the lr-form-field attribute');
                }

                var touchedOrSubmitted = '';
                if (attrs.waitForSubmit !== undefined) {
                    touchedOrSubmitted = formName + '[\'' + fieldName + '\'].$touched || ';
                }
                touchedOrSubmitted += formName + '.$submitted';

                var input = element.find(attrs.inputName ? ('input[name="' + attrs.inputName + '"]') : 'input[type="text"], input[type="number"], input[type="email"], input[type="password"], textarea');
                input.attr('name', fieldName);
                input.addClass('form-control');

                var label = element.find('label');
                if (label) {
                    label.addClass('control-label');
                }

                // Add ng-message for ui-mask elements
                var ngMessages = element.find('[ng-messages]');
                if (input.attr('ui-mask')) {
                    var ngMessageElts = '<div ng-message="mask">Value is incomplete.</div><div ng-message="parse">Value is formatted incorrectly.</div>';

                    if (!ngMessages || !ngMessages[0]) {
                        ngMessages = angular.element('<div ng-messages>'+ ngMessageElts +'</div>');
                        element.append(ngMessages);
                    }
                    else {
                        ngMessages.append(ngMessageElts);
                    }
                }

                if (ngMessages && ngMessages[0]) {
                    ngMessages.attr('ng-messages', formName + '[\'' + fieldName + '\'].$error');
                    ngMessages.attr('ng-show', touchedOrSubmitted);
                    ngMessages.attr('role', 'alert');
                    ngMessages.addClass('help-block text-danger');
                }

                var classes = '{ \'has-error\' : ' + formName + '[\'' + fieldName + '\'].$invalid && (' + touchedOrSubmitted + ') }';
                element.attr('ng-class', classes);

                element.removeAttr('grape-form-field');
                element.removeAttr('data-grape-form-field');

                $compile(element)(scope);
            }
        };
    });
}(angular.module('Common.GrapeFormField', [])));