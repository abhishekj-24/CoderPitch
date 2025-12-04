import react ,{useState} from 'react'
import { Plus, Edit, Trash2, Home , RefreshCcw,Zap, Trash } from 'lucide-react'
import { NavLink } from 'react-router'

function Admin(){
    const [selectOption , setselectOption] = useState(null)

    const adminoption =[
        {
            id : 'create',
            title: 'Create Problem',
            description: 'Add new problem to platform',
            icon: Plus,
            color: 'btn-success',
            bgColor: 'bg-success/10',
            route: '/admin/create'
        },

        {
            id: 'update',
            title: 'update Problem',
            description: 'update the existing problem',
            icon: Edit,
            color: 'btn-warning',
            bgColor: 'bg-warning/10',
            route: '/admin/update'
        },

        {
            id: 'delete',
            title: 'Delete Problem',
            description: 'remove the problem form platform',
            icon: Trash,
            color: 'btn-error',
            bgColor: 'bg-error/10',
            route: '/admin/delete'
        }
    ]

    return(
        <div className='min-h-screen bg-base-300'>
          <div className='container mx-auto px-4 py-8'>
            {/* Header */}
            <div className='text-center mb-12'>
              <h1 className='text-4xl font-bold text-base-content mb-4'>Admin Panel</h1>
              <p className='text-base-content/70 text-lg'>
                Manage Problems on your Platform
              </p>  
            </div>

            {/* Admin option grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
              {adminoption.map((option)=>{
                const IconComponent = option.icon
                return(
                  <div key={option.id}
                  className='card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover: -translate-y-2 cursor-pointer'>
                    <div className='card-body items-center p-8'>
                        {/* icon  */}
                      <div className={`${option.bgColor} p-4 rounded-full mb-4`}>
                        <IconComponent size={32} className='text-base-content'/>
                      </div>

                      {/* Title */}
                      <h2 className='card-title text-xl mb-2'>
                        {option.title}
                      </h2>

                      {/* description */}
                      <p className='text-base-content/70 mb-6'>
                        {option.description}
                      </p>

                      {/* action buttons */}
                      <div className='card-actions'>
                        <div className='card-actions'>
                          <NavLink to={option.route} className={`btn ${option.color} btn-wide`}>
                            {option.title}
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })} 
            </div>
          </div>
        </div>
    )


}


export default Admin




    //     const adminoption = [
    //     {
    //         id: 'create',
    //         title: 'Create Problem',
    //         description: 'Add new problem to platform',
    //         icon: Plus,
    //         color: 'from-green-500 to-emerald-500',
    //         hoverColor: 'from-green-400 to-emerald-400',
    //         bgColor: 'bg-green-500/20',
    //         iconColor: 'text-green-400',
    //         route: '/admin/create'
    //     },
    //     {
    //         id: 'update',
    //         title: 'Update Problem',
    //         description: 'Update the existing problem',
    //         icon: Edit,
    //         color: 'from-amber-500 to-orange-500',
    //         hoverColor: 'from-amber-400 to-orange-400',
    //         bgColor: 'bg-amber-500/20',
    //         iconColor: 'text-amber-400',
    //         route: '/admin/update'
    //     },
    //     {
    //         id: 'delete',
    //         title: 'Delete Problem',
    //         description: 'Remove the problem from platform',
    //         icon: Trash,
    //         color: 'from-red-500 to-pink-500',
    //         hoverColor: 'from-red-400 to-pink-400',
    //         bgColor: 'bg-red-500/20',
    //         iconColor: 'text-red-400',
    //         route: '/admin/delete'
    //     }
    // ]

    // return(
    //     <div className="min-h-screen flex justify-center items-start relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
    //         {/* Background effects */}
    //         <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
    //         <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
            
    //         <div className="container mx-auto px-4 py-8 z-10">
    //             {/* Header */}
    //             <div className="text-center mb-12">
    //                 <h1 className="text-4xl font-bold text-white mb-4">⚙️ Admin Panel</h1>
    //                 <p className="text-gray-400 text-lg">
    //                     Manage problems on your platform
    //                 </p>  
    //             </div>

    //             {/* Admin option grid */}
    //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
    //                 {adminoption.map((option) => {
    //                     const IconComponent = option.icon
    //                     return(
    //                         <div 
    //                             key={option.id}
    //                             className="card bg-gray-900/80 backdrop-blur-md border border-gray-700 shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
    //                         >
    //                             <div className="card-body items-center p-8">
    //                                 {/* Icon */}
    //                                 <div className={`${option.bgColor} p-5 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
    //                                     <IconComponent size={36} className={option.iconColor}/>
    //                                 </div>

    //                                 {/* Title */}
    //                                 <h2 className="card-title text-xl mb-3 text-white text-center">
    //                                     {option.title}
    //                                 </h2>

    //                                 {/* Description */}
    //                                 <p className="text-gray-400 mb-6 text-center leading-relaxed">
    //                                     {option.description}
    //                                 </p>

    //                                 {/* Action Button */}
    //                                 <div className="card-actions w-full">
    //                                     <NavLink 
    //                                         to={option.route} 
    //                                         className={`w-full btn bg-gradient-to-r ${option.color} hover:${option.hoverColor} text-white font-semibold border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300`}
    //                                     >
    //                                         <IconComponent size={20} className="mr-2" />
    //                                         {option.title}
    //                                     </NavLink>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     )
    //                 })} 
    //             </div>

    //             {/* Additional Actions */}
    //             <div className="flex justify-center mt-12 gap-4">
    //                 <NavLink 
    //                     to="/" 
    //                     className="btn bg-gray-800/80 border-gray-700 text-white hover:bg-gray-700/80 hover:border-indigo-500 transition-all duration-300 px-8"
    //                 >
    //                     <Home size={20} className="mr-2" />
    //                     Back to Home
    //                 </NavLink>
    //                 <button className="btn bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white border-0 transition-all duration-300 px-8">
    //                     <RefreshCcw size={20} className="mr-2" />
    //                     Refresh Data
    //                 </button>
    //             </div>
    //         </div>
    //     </div>
    // )