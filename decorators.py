"""
Decorators for Application.
"""
from django.http      import HttpResponse
from django.template  import RequestContext
from django.shortcuts import render_to_response

def template(template_name):
    """
    Parameterized decorator to manage context rendering.  Will integrate a RequestContext wrapper
    on a dictionary returned by view.

    If the view returns the special string 'OK' then it will be returned in a simple HttpResponse
    object.  'OK' is used as a special flag for ajax form calls, indicating success.

    HttpResponse objects directly returned by the view will be passed through as-is.
    """
    def function_builder(func):
        def view(request,*args,**kwargs):
            response = func(request,*args,**kwargs)
            if isinstance(response,HttpResponse):
                return response
            elif response == 'OK':
                return HttpResponse('OK')
            else:
                return render_to_response(template_name,response,context_instance=RequestContext(request))
        return view
    return function_builder
