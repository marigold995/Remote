using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using Microsoft.Owin.Security.OAuth;
using MyApp.Interfaces;
using MyApp.Repository;
using Newtonsoft.Json.Serialization;
using ProductService.Resolver;
using Unity;
using Unity.Lifetime;

namespace MyApp
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // Unity
            var container = new UnityContainer();
            container.RegisterType<IUserRepository, UserRepository>(new HierarchicalLifetimeManager());
            container.RegisterType<ISkillRepository, SkillRepo>(new HierarchicalLifetimeManager());
            container.RegisterType<IUserSkillRepository, UserSkillRelationRepo>(new HierarchicalLifetimeManager());
            config.DependencyResolver = new UnityResolver(container);

            // CORS
            var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);
        }
    }
}
