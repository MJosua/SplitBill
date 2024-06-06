import { Image } from "@chakra-ui/react"
import Header from "../../Component/Base/Header"

function HomeLandingPage() {

    return (

        <div className="body px-md-5 ">


            <div className="container-fluid  position-relative">
                <div className="row vh-100 pt-4 ">
                    <Header />

                    <div className="col-12  pt-5 pb-5 h-100">
                        <div className="row h-100">
                            <div className="col-1">

                            </div>
                            <div className="col-12 col-md-11 pt-4 pb-4 px-3 h-100">
                                <div className="kartu shadow-offset py-2 px-3 h-100 text-primary">
                                    Task Status
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className=" d-none d-md-flex w-25
                    position-absolute  bottom-0 justify-content-start mb-5  px-0 h-25">
                        <div className="col-12 mb-5 ms-5 my-3 pb-5 fw-bold 
                        fs-2  d-flex text-center align-items-center   justify-content-center
                        text-uppercase text-white
                        ">
                            <Image
                                objectFit='cover'
                                className="kartu shadow-red "
                                src='task-paper.jpg'
                            />
                        </div>
                    </div>

                    <div className="d-none d-md-flex w-25
                    position-absolute me-5  top-0  mt-5 left-0 mb-5   px-0 h-25">
                        <div className="ms-5 ps-5">
                            <div className=" col-12 my-3 fw-bold 
                        fs-2  d-flex text-center align-items-center   justify-content-center
                        text-uppercase text-white
                        ">
                                <Image
                                    objectFit='cover'
                                    className="kartu shadow-red "
                                    src='desk-full.jpg'
                                />
                            </div>
                        </div>
                    </div>

                    <div className="d-none d-md-flex w-25
                    position-absolute mt-5  pt-5  px-5 justify-content-start mb-5  d-flex px-0 h-25">
                        <div className="col-12 mt-5 pt-5  my-3 fw-bold 
                        fs-2  d-flex text-center align-items-center   justify-content-center
                        text-uppercase text-white
                        ">
                            <Image
                                objectFit='cover'
                                className="kartu shadow-red "
                                src='task-calendar.jpg'
                            />
                        </div>
                    </div>

                </div>
            </div>



        </div>

    )
}

export default HomeLandingPage